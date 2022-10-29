import mongoose from "mongoose";
const { Schema } = mongoose;

// **************************************************

const pageController = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    title: {
      type: String,
    },
    sub_title: {
      type: String,
    },
    section: {
      type: mongoose.Schema.ObjectId,
      ref: "Section",
    },
  },
  { timestamps: true },
  { collection: "Pages" }
);

pageController.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ****************************************************

const Page = mongoose.model("Page", pageController);

export default Page;
