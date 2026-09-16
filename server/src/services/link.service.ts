import { Link } from "../models/Link";
import { ClickEvent } from "../models/ClickEvent";
import { generateShortCode } from "../utils/shortCode";
import { AppError } from "../utils/AppError";

export const createLink = async (userId: string, destinationUrl: string, customSlug?: string) => {
  let shortCode = customSlug;
  let slugType: "auto" | "custom" = "custom";

  if (!shortCode) {
    slugType = "auto";
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      shortCode = generateShortCode();
      const exists = await Link.exists({ shortCode });
      if (!exists) {
        isUnique = true;
      }
      attempts++;
    }
    if (!isUnique) throw new AppError(500, "CODE_GENERATION_FAILED", "Failed to generate unique short code");
  } else {
    const exists = await Link.exists({ shortCode });
    if (exists) {
      throw new AppError(409, "SLUG_ALREADY_EXISTS", `The slug '${shortCode}' is already in use.`);
    }
  }

  const link = await Link.create({
    userId,
    destinationUrl,
    shortCode,
    slugType,
  });

  return link;
};

export const getLinks = async (userId: string, page: number = 1, limit: number = 10, search?: string) => {
  const query: any = { userId };
  
  if (search) {
    query.$or = [
      { destinationUrl: { $regex: search, $options: "i" } },
      { shortCode: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Link.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Link.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getLinkById = async (userId: string, id: string) => {
  const link = await Link.findOne({ _id: id, userId });
  if (!link) {
    throw new AppError(404, "NOT_FOUND", "Link not found");
  }
  return link;
};

export const deleteLink = async (userId: string, id: string) => {
  const link = await Link.findOneAndDelete({ _id: id, userId });
  if (!link) {
    throw new AppError(404, "NOT_FOUND", "Link not found");
  }
  // Delete associated clicks
  await ClickEvent.deleteMany({ linkId: id });
  return link;
};
