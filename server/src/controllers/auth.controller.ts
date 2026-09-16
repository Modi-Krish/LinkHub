import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { BioProfile } from "../models/BioProfile";
import * as authService from "../services/auth.service";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = env.NODE_ENV === "production";
  const domain = isProd && env.COOKIE_DOMAIN === "localhost" ? undefined : env.COOKIE_DOMAIN;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE || isProd,
    sameSite: isProd ? "none" : "lax",
    domain: domain || undefined,
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE || isProd,
    sameSite: isProd ? "none" : "lax",
    domain: domain || undefined,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) throw new AppError(409, "EMAIL_IN_USE", "Email is already in use");
      if (existingUser.username === username) throw new AppError(409, "USERNAME_IN_USE", "Username is already in use");
    }

    const user = await User.create({ name, email, username, passwordHash: password });
    
    // Auto-create basic bio profile
    await BioProfile.create({
      userId: user._id,
      username: user.username,
      displayName: user.name,
    });

    // Simulate verification
    console.log(`[SIMULATION] Verification email sent to ${email}. Token: VERIFY_${user._id}`);

    res.status(201).json({
      success: true,
      data: { message: "User registered successfully. Please verify your email." },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const accessToken = authService.generateAccessToken(user);
    const refreshToken = await authService.generateRefreshToken(user);

    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new AppError(401, "NO_REFRESH_TOKEN", "No refresh token provided");
    }

    const { user, tokenRecord } = await authService.verifyRefreshToken(refreshToken);
    
    // Rotate tokens
    await authService.revokeRefreshToken(refreshToken);
    
    const newAccessToken = authService.generateAccessToken(user);
    const newRefreshToken = await authService.generateRefreshToken(user);

    setCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      data: { message: "Tokens refreshed successfully" },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await authService.revokeRefreshToken(refreshToken);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      data: { message: "Logged out successfully" },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't leak user existence
      return res.status(200).json({ success: true, data: { message: "If an account exists, a reset link was sent." } });
    }

    const token = await authService.generatePasswordResetToken(user);
    console.log(`[SIMULATION] Reset password link: ${env.CLIENT_URL}/reset-password/${token}`);

    res.status(200).json({ success: true, data: { message: "If an account exists, a reset link was sent." } });
  } catch (error) {
    next(error);
  }
};
