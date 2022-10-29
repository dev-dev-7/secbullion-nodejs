import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceSchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true },
  { collection: "Services" }
);

serviceSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ****************************************************

const Service = mongoose.model("Service", serviceSchema);

export default Service;
