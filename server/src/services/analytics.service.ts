import { ClickEvent } from "../models/ClickEvent";
import { Link } from "../models/Link";
import { UAParser } from "ua-parser-js";
import { hashIpAddress } from "../utils/ipHash";

export const logClickEvent = async (
  linkId: string,
  ip: string,
  userAgent: string,
  referer: string
) => {
  try {
    const ipHash = hashIpAddress(ip);
    
    // Parse User Agent
    const parser = new UAParser(userAgent);
    const deviceTypeStr = parser.getDevice().type;
    
    let deviceType: "Mobile" | "Desktop" | "Tablet" | "Unknown" = "Desktop"; // Default to desktop if no type (like for most desktop browsers)
    
    if (deviceTypeStr === "mobile") deviceType = "Mobile";
    else if (deviceTypeStr === "tablet") deviceType = "Tablet";

    // Extract referrer domain
    let referrer = "Direct";
    if (referer) {
      try {
        const url = new URL(referer);
        referrer = url.hostname;
      } catch (e) {
        referrer = referer;
      }
    }

    // Fire and forget
    await ClickEvent.create({
      linkId,
      timestamp: new Date(),
      referrer,
      deviceType,
      ipHash,
    });
  } catch (error) {
    console.error("Failed to log click event:", error);
    // Do not throw, this is async telemetry
  }
};

export const getAnalytics = async (linkId: string, range: string) => {
  let dateFilter = new Date();
  
  if (range === "7d") {
    dateFilter.setDate(dateFilter.getDate() - 7);
  } else if (range === "90d") {
    dateFilter.setDate(dateFilter.getDate() - 90);
  } else {
    // default 30d
    dateFilter.setDate(dateFilter.getDate() - 30);
  }

  const matchStage = {
    $match: {
      linkId: linkId as any, // Will be cast to ObjectId by mongoose during execution if defined in schema, or we can use mongoose.Types.ObjectId
      timestamp: { $gte: dateFilter },
    },
  };

  const [totalClicks, clicksOverTime, topReferrers, deviceDistribution] = await Promise.all([
    ClickEvent.countDocuments({ linkId }),
    
    ClickEvent.aggregate([
      matchStage,
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          clicks: 1,
        },
      },
    ]),

    ClickEvent.aggregate([
      matchStage,
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          referrer: "$_id",
          count: 1,
        },
      },
    ]),

    ClickEvent.aggregate([
      matchStage,
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          device: "$_id",
          count: 1,
        },
      },
    ]),
  ]);

  return {
    summary: { totalClicks },
    clicksOverTime,
    topReferrers,
    deviceDistribution,
  };
};
