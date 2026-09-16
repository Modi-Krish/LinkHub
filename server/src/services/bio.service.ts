import { BioProfile } from "../models/BioProfile";
import { SocialLink } from "../models/SocialLink";
import { AppError } from "../utils/AppError";

export const getProfile = async (userId: string) => {
  const profile = await BioProfile.findOne({ userId });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Profile not found");

  const links = await SocialLink.find({ profileId: profile._id }).sort({ order: 1 });
  return { profile, links };
};

export const updateProfile = async (userId: string, data: any) => {
  const profile = await BioProfile.findOneAndUpdate({ userId }, data, { new: true, runValidators: true });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Profile not found");
  return profile;
};

export const addSocialLink = async (userId: string, data: any) => {
  const profile = await BioProfile.findOne({ userId });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Profile not found");

  const lastLink = await SocialLink.findOne({ profileId: profile._id }).sort({ order: -1 });
  const newOrder = lastLink ? lastLink.order + 1 : 0;

  const socialLink = await SocialLink.create({
    profileId: profile._id,
    ...data,
    order: newOrder,
  });

  return socialLink;
};

export const updateSocialLink = async (userId: string, linkId: string, data: any) => {
  const profile = await BioProfile.findOne({ userId });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Profile not found");

  const socialLink = await SocialLink.findOneAndUpdate(
    { _id: linkId, profileId: profile._id },
    data,
    { new: true, runValidators: true }
  );
  if (!socialLink) throw new AppError(404, "NOT_FOUND", "Social link not found");

  return socialLink;
};

export const deleteSocialLink = async (userId: string, linkId: string) => {
  const profile = await BioProfile.findOne({ userId });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Profile not found");

  const socialLink = await SocialLink.findOneAndDelete({ _id: linkId, profileId: profile._id });
  if (!socialLink) throw new AppError(404, "NOT_FOUND", "Social link not found");
};

export const reorderSocialLinks = async (userId: string, orderedIds: string[]) => {
  const profile = await BioProfile.findOne({ userId });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Profile not found");

  const updates = orderedIds.map((id, index) =>
    SocialLink.updateOne({ _id: id, profileId: profile._id }, { order: index })
  );

  await Promise.all(updates);
};

export const getPublicProfile = async (username: string) => {
  const profile = await BioProfile.findOneAndUpdate(
    { username },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!profile) throw new AppError(404, "NOT_FOUND", "Profile not found");

  const links = await SocialLink.find({ profileId: profile._id, enabled: true }).sort({ order: 1 });
  
  return {
    profile: {
      displayName: profile.displayName,
      username: profile.username,
      bio: profile.bio,
      avatar: profile.avatar,
      theme: profile.theme,
    },
    links: links.map(l => ({
      id: l._id,
      platform: l.platform,
      label: l.label,
      url: l.url,
      icon: l.icon,
    }))
  };
};
