import mongoose from "mongoose";
const { Schema } = mongoose;

const portfolioSchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
  { collection: "Portfolios" }
);

portfolioSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ****************************************************

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
