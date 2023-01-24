const cartModel = require("./cartModel");
const productModel = require("../product/productModel");
const { validationResult } = require("express-validator");
const {
  getAllSymbolsPrice,
} = require("../../helpers/mt5Commands/getProductPrice");

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let items = req.body.items;
  if (items.length) {
    for (var i = 0; i < items.length; i++) {
      let existCart = await cartModel.getUserCartProductByType(
        req.body.user_id,
        req.body.product_id,
        items[i].type
      );
      if (existCart) {
        if (items[i].quantity == 0) {
          await cartModel.deleteUserCart(
            req.body.user_id,
            req.body.product_id,
            items[i].type
          );
        } else {
          await cartModel.update(
            req.body.user_id,
            req.body.product_id,
            items[i].type,
            items[i]
          );
        }
      } else {
        if (items[i].quantity != 0) {
          await cartModel.create(
            req.body.user_id,
            req.body.product_id,
            items[i]
          );
        }
      }
    }
  }
  let carts = await cartModel.getCartByUserId(req.body.user_id);
  if (carts) {
    return res.status(201).json({ data: carts });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.get = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const cart = {};
  const cartItems = await cartModel.getCartByUserId(req.params.user_id);
  let mt5PriceArray = await getAllSymbolsPrice(cartItems);
  let coupon = await cartModel.getCoupon(req.body.coupon_code);
  if (cartItems) {
    cart.subtotal = 0;
    cart.discount_price = coupon ? coupon.discount_price : 0;
    cart.coupon_code = req.body.coupon_code;
    cart.total = 0;
    if (cartItems.length) {
      for (var c = 0; c < cartItems.length; c++) {
        cartItems[c].product = await productModel.getById(
          cartItems[c].product_id
        );
        cartItems[c].product.files = await productModel.getByFilesByProduct(
          cartItems[c].product_id
        );
        cartItems[c].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          unit: cartItems[c].product.unit,
          price: await getPriceFromSymbol(
            mt5PriceArray,
            cartItems[c].product.symbol
          ),
          current_rate: cartItems[c].product.price,
        };
        cart.subtotal += await getPriceFromSymbol(
          mt5PriceArray,
          cartItems[c].product.symbol
        );
      }
    }
    cart.items = cartItems;
    cart.total = cart.subtotal - cart.discount_price;
  }
  if (cart) {
    return res.status(201).json({ data: cart });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let existCart = await cartModel.getUserCartProductByType(
    req.params.user_id,
    req.body.product_id,
    req.body.type
  );
  if (existCart) {
    let carts = await cartModel.update(
      req.params.user_id,
      req.body.product_id,
      req.body.type,
      req.body
    );
    return res.status(200).json({ data: carts });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.delete = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let del = await cartModel.deleteUserCart(
    req.params.user_id,
    req.params.product_id,
    req.params.type
  );
  if (del) {
    return res
      .status(200)
      .json({ data: await cartModel.getCartByUserId(req.params.user_id) });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

async function getPriceFromSymbol(symbols = "", key = "") {
  if (symbols && key) {
    let result = symbols.filter(function (symbol) {
      return symbol.Symbol == key;
    });
    return result[0]?.Ask;
  } else {
    return 60;
  }
}
