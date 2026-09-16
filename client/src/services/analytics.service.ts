import { api } from "./api";

export const getLinkAnalytics = async (linkId: string, range: "7d" | "30d" | "90d" = "30d") => {
  const response = await api.get(`/analytics/${linkId}/analytics`, {
    params: { range },
  });
  return response.data.data;
};
