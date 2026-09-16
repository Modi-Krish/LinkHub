import mongoose, { Schema, Document } from "mongoose";

export interface ISocialLink extends Document {
  profileId: mongoose.Types.ObjectId;
  platform: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
  enabled: boolean;
}

const SocialLinkSchema = new Schema(
  {
    profileId: { type: Schema.Types.ObjectId, ref: "BioProfile", required: true },
    platform: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String },
    order: { type: Number, required: true, default: 0 },
    enabled: { type: Boolean, default: true },
  }
);

SocialLinkSchema.index({ profileId: 1, order: 1 });

export const SocialLink = mongoose.model<ISocialLink>("SocialLink", SocialLinkSchema);
