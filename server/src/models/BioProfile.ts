import mongoose, { Schema, Document } from "mongoose";

export interface IBioProfile extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  theme: "minimal-light" | "dark-slate" | "gradient";
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BioProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    username: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    theme: { type: String, enum: ["minimal-light", "dark-slate", "gradient"], default: "minimal-light" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const BioProfile = mongoose.model<IBioProfile>("BioProfile", BioProfileSchema);
