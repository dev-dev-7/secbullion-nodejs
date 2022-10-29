import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    title: {
      type: String,
    },
    sub_title: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
  },
  { timestamps: true },
  { collection: "Categories" }
);

categorySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ****************************************************

const Category = mongoose.model("Category", categorySchema);

export default Category;
