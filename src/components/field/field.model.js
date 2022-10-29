import mongoose from "mongoose";
const { Schema } = mongoose;

// **************************************************

const fieldSchema = new mongoose.Schema(
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
      ref: "Field",
    },
  },
  { timestamps: true },
  { collection: "Sections" }
);

fieldSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ****************************************************

const Field = mongoose.model("Field", fieldSchema);

export default Field;
