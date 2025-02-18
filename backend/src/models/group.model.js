import mongoose from "mongoose";
export const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Group= new mongoose.model("Group",GroupSchema);

export default Group