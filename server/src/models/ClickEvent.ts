import mongoose, { Schema, Document } from "mongoose";

export interface IClickEvent extends Document {
  linkId: mongoose.Types.ObjectId;
  timestamp: Date;
  referrer: string;
  deviceType: "Mobile" | "Desktop" | "Tablet" | "Unknown";
  ipHash: string;
}

const ClickEventSchema = new Schema(
  {
    linkId: { type: Schema.Types.ObjectId, ref: "Link", required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    referrer: { type: String, default: "Direct" },
    deviceType: { type: String, enum: ["Mobile", "Desktop", "Tablet", "Unknown"], default: "Unknown" },
    ipHash: { type: String, required: true },
  }
);

// Indexes for analytics aggregation
ClickEventSchema.index({ linkId: 1, timestamp: -1 });

export const ClickEvent = mongoose.model<IClickEvent>("ClickEvent", ClickEventSchema);
