import Hash from "../../helpers/Hash.js";
import mongoose from "mongoose";
import Role from "../../enum/role.enum.js";
const { Schema } = mongoose;

// **************************************************************

const userSchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    full_name: {
      type: String,
      required: [true, "Please tell us your full name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
    },
    active: {
      type: Number,
      default: 1,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    password: {
      type: String,
      required: [true, "Please provied a password"],
      minlength: 8,
      select: false,
    },
    country_code: {
      type: Object,
      required: true,
    },
    mobile: {
      type: String,
      required: [true, "Please provied a mobile number"],
    },
    picture: {
      type: String,
      default: "https://mui.com/static/images/avatar/1.jpg",
    },
    address: {
      type: Object,
      required: [true, "Please provied a address"],
    },
    password_changed_at: {
      type: Date,
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } },

  { timestamps: true },
  { collection: "Users" }
);

// **************************************************************

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
// toJSON: { virtuals: true },

// Virtual populate
// userSchema.virtual("auctions", {
//   ref: "Auction",
//   foreignField: "user_id",
//   localField: "_id",
// });

// **************************************************************

userSchema.pre("save", function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  this.password = Hash.make(this.password);
  this.password_changed_at = Date.now() - 1000;
  next();
});

// **************************************************************

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// **************************************************************

// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

// **************************************************************

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.password_changed_at) {
    const changedTimestamp = parseInt(
      this.password_changed_at.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// **************************************************************

const User = mongoose.model("User", userSchema);

export default User;
