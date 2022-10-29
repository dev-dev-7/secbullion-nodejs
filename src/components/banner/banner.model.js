import mongoose from "mongoose";
const { Schema } = mongoose;

const bannerSchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    text: {
      type: String,
    },
    btn_text: {
      type: String,
    },
    btn_link: {
      type: String,
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
  },
  { timestamps: true },
  { collection: "Banners" }
);

bannerSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ****************************************************

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
