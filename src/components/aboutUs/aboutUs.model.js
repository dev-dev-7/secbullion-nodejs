import mongoose from "mongoose";
const { Schema } = mongoose;

const aboutUsSchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    who_we_are: {
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
  { collection: "AboutUs" }
);

aboutUsSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ****************************************************

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

export default AboutUs;
