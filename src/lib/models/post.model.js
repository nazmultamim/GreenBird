import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    width: Number,
    height: Number,
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    username: String,
    profileImg: String,
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      maxlength: 280,
      default: "",
    },
    media: {
      type: [mediaSchema],
      default: [],
      validate: {
        validator(media) {
          return media.length <= 4;
        },
        message: "A post can have at most 4 media files.",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: "",
    },
    verificationBadge: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

postSchema.pre("validate", function validatePostContent(next) {
  if (!this.text?.trim() && this.media.length === 0) {
    next(new Error("Post text or media is required."));
    return;
  }

  next();
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
