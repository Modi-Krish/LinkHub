import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import { PasswordResetToken } from "../models/PasswordResetToken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as any }
  );
};

export const generateRefreshToken = async (user: IUser) => {
  const token = crypto.randomBytes(40).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  
  // 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  return token;
};

export const verifyRefreshToken = async (token: string) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  
  const tokenRecord = await RefreshToken.findOne({
    tokenHash,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (!tokenRecord) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid or expired refresh token");
  }

  const user = await User.findById(tokenRecord.userId);
  if (!user) {
    throw new AppError(401, "USER_NOT_FOUND", "User not found");
  }

  return { user, tokenRecord };
};

export const revokeRefreshToken = async (token: string) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await RefreshToken.findOneAndUpdate(
    { tokenHash },
    { revokedAt: new Date() }
  );
};

export const generatePasswordResetToken = async (user: IUser) => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  return token;
};
