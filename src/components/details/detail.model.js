import mongoose from "mongoose";
const { Schema } = mongoose;

const detailSchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    youtube: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    email: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
    who_we_are: {
      type: String,
    },
    about_us: {
      type: String,
    },
    our_mission: {
      type: String,
    },
    our_vision: {
      type: String,
    },
    why_us: {
      type: String,
    },
  },
  { timestamps: true },
  { collection: "Details" }
);

detailSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ****************************************************

const Detail = mongoose.model("Detail", detailSchema);

export default Detail;
