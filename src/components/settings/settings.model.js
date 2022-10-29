import mongoose from "mongoose";
const { Schema } = mongoose;

const settingsSchema = new mongoose.Schema(
  {
    id: Schema.Types.ObjectId,
    email: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
    social_links: [{ type: String }],
  },
  { timestamps: true },
  { collection: "Banners" }
);

settingsSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ****************************************************

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
