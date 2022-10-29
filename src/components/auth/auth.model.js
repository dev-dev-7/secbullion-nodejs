import mongoose from "mongoose";
const { Schema } = mongoose;

// *********************************************************************
// REFRESH_TOKEN

const RefreshTokenSchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user_id is required"],
    },
    token: {
      type: String,
      required: [true, "token is required"],
    },
  },
  { timestamps: true }
);

// *********************************************************************
// RESET_PASSWORD_TOKEN

const ResetPasswordTokenSchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user_id is required"],
    },
    otp_code: {
      type: String,
      required: [true, "otp_code is required"],
    },
    verified_before: {
      type: Boolean,
      default: false,
    },
    secret_hash: {
      type: String,
      required: [true, "secret_hash is required"],
    },
    expire_at: {
      type: Date,
      required: [true, "expire_at is required"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

// ****************************

ResetPasswordTokenSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// *********************************************************************

export const ResetPasswordToken = mongoose.model(
  "ResetPasswordToken",
  ResetPasswordTokenSchema
);

export const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

// module.exports = { ResetPasswordToken, RefreshToken };
