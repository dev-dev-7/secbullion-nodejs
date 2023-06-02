require('dotenv').config()
const orderModel = require('./orderModel')
const cartModel = require('./../cart/cartModel')
const productModel = require('../product/productModel')
const walletModel = require('../wallet/walletModel')
const profileModel = require('../profile/profileModel')
const { validationResult } = require('express-validator')
const { buyPosition } = require('../../helpers/mt5')
const { updateWalletAmount } = require('../../helpers/updateWallet')
const { authorization } = require('../../helpers/authorization')

async function getGrandTotal(cartItems, discount_price) {
  let grandTotal = 0
  if (cartItems.length) {
    for (var i = 0; i < cartItems.length; i++) {
      cartItems[i].product = await productModel.getById(cartItems[i].product_id)
      grandTotal += cartItems[i].product.last_price * cartItems[i].quantity
    }
  }
  return grandTotal - discount_price
}

exports.orderSummary = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  let user = await authorization(req, res)
  const order = {}
  let cartItems = await cartModel.getCartByUserId(user.user_id)
  let coupon = await cartModel.getCoupon(req.body.coupon_code)
  if (cartItems) {
    ;(order.currency = process.env.DEFAULT_CURRENCY), (order.subtotal = 0)
    order.coupon_used = coupon ? coupon.discount_price : 0
    order.total = 0
    if (cartItems.length) {
      for (var i = 0; i < cartItems.length; i++) {
        cartItems[i].product = await productModel.getById(
          cartItems[i].product_id,
        )
        cartItems[i].product.files = await productModel.getByFilesByProduct(
          cartItems[i].product_id,
        )
        order.subtotal +=
          cartItems[i].product.last_price * cartItems[i].quantity
      }
    }
    order.items = cartItems
    order.total = await getGrandTotal(cartItems, order.coupon_used)
    return res.status(201).json({ data: order })
  } else {
    return res.status(400).json({ errors: [{ msg: 'Bad Request' }] })
  }
}

exports.submit = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  let user = await authorization(req, res)
  let cartItems = await cartModel.getCartByUserId(user.user_id)
  if (cartItems?.length) {
    let coupon = await cartModel.getCoupon(req.body.coupon_code)
    req.body.discount_price = coupon ? coupon.discount_price : 0
    let grandTotal = await getGrandTotal(cartItems, req.body.discount_price)
    if (req.body.payment_method == 'wallet') {
      let wallet = await walletModel.getWalletByUserId(user.user_id)
      if (wallet.cash_balance < grandTotal) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Not enough wallet balance' }] })
      } else {
        await updateWalletAmount(user.user_id, grandTotal, '-', 'New%20Order')
      }
    } else if (req.body.payment_method == 'checkout') {
      return res.status(400).json({ errors: [{ msg: 'Bad Request' }] })
    }
    // Insert Order
    let order = await orderModel.create(req.body)
    if (order) {
      let mt5AccountNumber = await profileModel.getUserMetaDataKey(
        user.user_id,
        'mt5_account_no',
      )
      let itemArray = req.body.items
      if (itemArray.length) {
        for (var i = 0; i < itemArray.length; i++) {
          let product = await productModel.getById(itemArray[i].product_id)
          itemArray[i].product = product
          itemArray[i].price = product.last_price

          if (itemArray[i].type === 'store' || itemArray[i].type === 'stake') {
            if (mt5AccountNumber?.meta_values) {
              let mt5OrderId = await buyPosition(
                mt5AccountNumber.meta_values,
                itemArray[i].product.symbol,
                itemArray[i].quantity,
              )
              if (mt5OrderId != 0) {
                let orderItem = await orderModel.insertOrderDetails(
                  user.user_id,
                  order.id,
                  itemArray[i],
                )
                if (orderItem) {
                  await orderModel.updateOrderProductTicketId(
                    orderItem.id,
                    mt5OrderId,
                  )
                }
              } else {
                await updateWalletAmount(
                  user.user_id,
                  product.last_price,
                  '+',
                  'Position%20failed%20cashback',
                )
              }
            }
          } else {
            await orderModel.insertOrderDetails(
              user.user_id,
              order.id,
              itemArray[i],
            )
          }
          if (itemArray[i].product) {
            itemArray[i].product.files = await productModel.getByFilesByProduct(
              itemArray[i].product_id,
            )
          }
          await cartModel.deleteUserCart(
            user.user_id,
            itemArray[i].product_id,
            itemArray[i].type,
          )
        }
      }
      let numOrderItems = await orderModel.getDetailsByOrderId(order.id)
      if (!numOrderItems.length) {
        await orderModel.deleteOrder(order.id)
        return res.status(400).json({ errors: [{ msg: 'Error' }] })
      }
      order.items = itemArray
    }
    return res
      .status(201)
      .json({ data: order, msg: 'order has been succesfully placed' })
  } else {
    return res.status(400).json({ errors: [{ msg: 'Bad Request' }] })
  }
}

exports.getMyStake = async (req, res) => {
  const product = await orderModel.getByStatus(req.params.user_id, ['stake'])
  if (product) {
    for (var i = 0; i < product.length; i++) {
      product[i].product = await productModel.getById(product[i].product_id)
      if (product[i].product) {
        product[i].product.files = await productModel.getByFilesByProduct(
          product[i].product_id,
        )
      }
    }
  }
  return res.status(201).json({ data: product })
}

exports.getMyStore = async (req, res) => {
  const product = await orderModel.getByStatus(req.params.user_id, ['store'])
  if (product) {
    for (var i = 0; i < product.length; i++) {
      product[i].product = await productModel.getById(product[i].product_id)
      if (product[i].product) {
        product[i].product.files = await productModel.getByFilesByProduct(
          product[i].product_id,
        )
      }
    }
  }
  return res.status(201).json({ data: product })
}

exports.getMyOrder = async (req, res) => {
  const product = await orderModel.getByStatus(req.params.user_id, [
    'collect',
    'deliver',
    'delivered',
    'sellback',
  ])
  if (product) {
    for (var i = 0; i < product.length; i++) {
      product[i].product = await productModel.getById(product[i].product_id)
      if (product[i].product) {
        product[i].product.files = await productModel.getByFilesByProduct(
          product[i].product_id,
        )
      }
      product[i].deliver_at = product[i].updated_at
    }
  }
  return res.status(201).json({ data: product })
}
