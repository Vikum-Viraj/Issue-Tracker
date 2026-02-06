import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    issues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
    }]
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
