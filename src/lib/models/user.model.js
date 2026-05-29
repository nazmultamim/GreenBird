import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        firstName: String,
        lastName: String,

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        avatar: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            maxlength: 160,
        },
        verificationBadge: {
            type: Boolean,
            default: false,
        },

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

const User =
    mongoose.models.User || mongoose.model("User", userSchema);

export default User;