import mongoose, { Schema, Document } from "mongoose";

export interface ILink extends Document {
  userId: mongoose.Types.ObjectId;
  destinationUrl: string;
  shortCode: string;
  slugType: "auto" | "custom";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LinkSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destinationUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    slugType: { type: String, enum: ["auto", "custom"], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
LinkSchema.index({ userId: 1, createdAt: -1 });

export const Link = mongoose.model<ILink>("Link", LinkSchema);
