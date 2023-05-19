require('dotenv').config()
const authModel = require('./authModel')
const profileModel = require('../profile/profileModel')
const walletModel = require('../wallet/walletModel')
const Hash = require('../../helpers/hash')
const jwt = require('jsonwebtoken')
const smsglobal = require('../../helpers/smsglobal')
// const time = require("../../helpers/time");
const config = require('../../config/index')
const { validationResult } = require('express-validator')
const { createMt5Account } = require('../../helpers/mt5')
const { JWT_SECRETE_KEY } = config.tokens

exports.login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const userEmail = await profileModel.getMetaDataKeyValue(
    'email',
    req.body.email,
  )
  if (userEmail === undefined) {
    return res.status(404).json({ errors: [{ msg: 'Invalid credentials' }] })
  } else {
    let otp_code = Math.floor(100000 + Math.random() * 900000)
    const userMobile = await profileModel.getUserMetaDataKey(
      userEmail.user_id,
      'mobile',
    )
    let user = await authModel.getUserById(userEmail.user_id)
    if (Hash.check(req.body.password, user.password)) {
      const token = jwt.sign({ user: user }, JWT_SECRETE_KEY)
      if (user.status == 0) {
        smsglobal.sendMessage(userMobile.meta_values, otp_code)
      }
      await profileModel.insertUserMetaData(
        userMobile.user_id,
        'otp_code',
        otp_code,
      )
      return res.status(200).json({
        data: {
          user: user,
          metadata: await profileModel.getUserMetaData(user.user_id),
        },
        token,
      })
    } else {
      return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] })
    }
  }
}

exports.register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const user = await authModel.createUser(req.body)
  if (user) {
    var arr = Object.entries(req.body)
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][0] != 'password') {
        let exist = await profileModel.getUserMetaDataKeyValue(
          user.user_id,
          arr[i][0],
          arr[i][1],
        )
        if (exist) {
          await profileModel.updateUserMetaData(
            user.user_id,
            arr[i][0],
            arr[i][1],
          )
        } else {
          await profileModel.insertUserMetaData(
            user.user_id,
            arr[i][0],
            arr[i][1],
          )
        }
      }
    }
    // Addtional fields
    let otp_code = Math.floor(100000 + Math.random() * 900000)
    if (user.user_id) {
      await profileModel.insertUserMetaData(user.user_id, 'otp_code', otp_code)
      await profileModel.insertUserMetaData(
        user.user_id,
        'user_id',
        user.user_id,
      )
      // create MT5 Accounts:
      req.body.user_id = user.user_id
      let mt5result = await createMt5Account(req.body)
      await profileModel.insertUserMetaData(
        user.user_id,
        'mt5_account_no',
        mt5result.Login,
      )
      await walletModel.insertWallet(
        user.user_id,
        0,
        0,
        0,
        process.env.DEFAULT_CURRENCY,
      )
      smsglobal.sendMessage(req.body.mobile, otp_code)
    }
    return res.status(201).json({
      data: {
        user: user,
        metadata: await profileModel.getUserMetaData(user.user_id),
      },
    })
  } else {
    return res.status(400).json({ errors: [{ msg: 'Bad Request' }] })
  }
}

exports.verifiyOtp = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  let mobile = await profileModel.getUserMetaDataKeyValue(
    req.body.user_id,
    'mobile',
    req.body.mobile,
  )
  if (mobile) {
    let otp_code = await profileModel.getUserMetaDataKeyValue(
      req.body.user_id,
      'otp_code',
      req.body.otp_code,
    )
    if (otp_code) {
      let user = await authModel.updateUser(req.body.user_id, { status: 1 })
      await profileModel.updateUserMetaData(
        req.body.user_id,
        'otp_code',
        Math.floor(100000 + Math.random() * 900000),
      )
      const token = jwt.sign({ user: user }, JWT_SECRETE_KEY)
      return res.status(201).json({
        data: {
          user: user,
          metadata: await profileModel.getUserMetaData(user.user_id),
        },
        token,
      })
    } else {
      return res.status(400).json({ errors: [{ msg: 'Invalid Code' }] })
    }
  } else {
    return res.status(404).json({ errors: [{ msg: 'Not Found' }] })
  }
}

exports.resendOtp = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  let otp_code = Math.floor(100000 + Math.random() * 900000)
  let mobile = await profileModel.getMetaDataKeyValue('mobile', req.body.mobile)
  if (mobile) {
    let otp = await profileModel.getUserMetaDataKey(mobile.user_id, 'otp_code')
    // let otpHistory = await profileModel.getUserHistoryKey(
    //   mobile.user_id,
    //   "otp_code",
    //   time.timeNow(600, "minus")
    // );
    // let otpAttemps = otpHistory ? otpHistory?.length : 0;
    if (otp) {
      //  && otpAttemps < 5
      await profileModel.updateUserMetaData(
        mobile.user_id,
        'otp_code',
        otp_code,
      )
      smsglobal.sendMessage(req.body.mobile, otp_code)
      await profileModel.insertUserHistory(mobile.user_id, 'otp_code', otp_code)
      return res.status(200).json({
        data: await profileModel.getUserMetaData(mobile.user_id),
        msg: 'Otp Sent',
      })
    } else {
      await profileModel.insertUserMetaData(
        mobile.user_id,
        'otp_code',
        otp_code,
      )
      return res.status(403).json({ errors: [{ msg: 'Too many request' }] })
    }
  } else {
    return res.status(404).json({ errors: [{ msg: 'Not Found' }] })
  }
}

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  let user = await authModel.updateUser(req.body.user_id, {
    password: Hash.make(req.body.password),
  })
  if (user) {
    await profileModel.updateUserMetaData(
      req.body.user_id,
      'otp_code',
      Math.floor(100000 + Math.random() * 900000),
    )
    return res.status(201).json({
      data: {
        user: user,
        metadata: await profileModel.getUserMetaData(user.user_id),
      },
      msg: 'Password Updated',
    })
  } else {
    return res.status(400).json({ errors: [{ msg: 'Invalid request' }] })
  }
}

exports.validateToken = async (req, res) => {
  if (req.query.token) {
    let password = Buffer.from(req.query.token, 'base64').toString('ascii')
    console.log(password)
    let user = await authModel.getUserByPassword(password)
    if (user) {
      return res.status(200).json({
        data: user,
      })
    }
  } else {
    return res.status(400).json({ errors: [{ msg: 'Invalid request' }] })
  }
}

exports.uploadDocuments = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  if (req.body.user_id) {
    let user = await authModel.getUserById(req.body.user_id)
    if (user) {
      var arr = Object.entries(req.body)
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][0] != 'user_id') {
          let exist = await profileModel.getUserMetaDataKeyValue(
            user.user_id,
            arr[i][0],
            arr[i][1],
          )
          if (exist) {
            await profileModel.updateUserMetaData(
              user.user_id,
              arr[i][0],
              arr[i][1],
            )
          } else {
            await profileModel.insertUserMetaData(
              user.user_id,
              arr[i][0],
              arr[i][1],
            )
          }
        }
      }
      return res.status(200).json({
        msg: 'Documents has been successfully submitted.',
      })
    }
  } else {
    return res.status(400).json({ errors: [{ msg: 'Invalid request' }] })
  }
}

exports.logout = async (req, res) => {
  return res.status(200).json({ msg: 'Logout success' })
}

exports.deleteAccount = async (req, res) => {
  return res.status(200).json({ msg: 'Account deleted' })
}
