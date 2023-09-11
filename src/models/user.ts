import mongoose from "mongoose";

const user = new mongoose.Schema({
    type: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    verification: {
        key: { type: String },
        access: { type: String },
        code: { type: String },
    },
    verified: { type: Boolean, default: false },
    creation: { type: Date, default: Date.now() }
});

export default mongoose.model("users", user);