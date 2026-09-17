import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Link } from "../models/Link";
import { BioProfile } from "../models/BioProfile";
import { SocialLink } from "../models/SocialLink";
import { connectDB } from "../config/db";
import "dotenv/config";

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Link.deleteMany({});
    await BioProfile.deleteMany({});
    await SocialLink.deleteMany({});

    console.log("Creating demo users...");
    const alice = await User.create({
      name: "Alice Admin",
      email: "alice@example.com",
      passwordHash: await bcrypt.hash("securePassword123", 10),
      username: "alice",
      isVerified: true
    });

    const bob = await User.create({
      name: "Bob User",
      email: "bob@example.com",
      passwordHash: await bcrypt.hash("securePassword456", 10),
      username: "bob",
      isVerified: true
    });

    console.log("Creating demo links...");
    await Link.create({
      userId: alice._id,
      destinationUrl: "https://github.com",
      shortCode: "github",
      slugType: "custom"
    });

    console.log("Creating demo bio profile...");
    await BioProfile.create({
      userId: alice._id,
      username: alice.username,
      displayName: "Alice in Wonderland",
      bio: "Full Stack Developer",
      theme: "minimal-light"
    });

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
