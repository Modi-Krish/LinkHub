import { api } from "./api";

export const getBioProfile = async () => {
  const response = await api.get("/bio/profile");
  return response.data.data;
};

export const updateBioProfile = async (data: any) => {
  const response = await api.put("/bio/profile", data);
  return response.data.data;
};

export const addSocialLink = async (data: any) => {
  const response = await api.post("/bio/links", data);
  return response.data.data;
};

export const updateSocialLink = async (id: string, data: any) => {
  const response = await api.put(`/bio/links/${id}`, data);
  return response.data.data;
};

export const deleteSocialLink = async (id: string) => {
  await api.delete(`/bio/links/${id}`);
};

export const reorderSocialLinks = async (orderedIds: string[]) => {
  const response = await api.patch("/bio/links/reorder", { orderedIds });
  return response.data.data;
};

export const getPublicBio = async (username: string, preview: boolean = false) => {
  const response = await api.get(`/public/bio/${username}`, {
    params: { preview }
  });
  return response.data.data;
};
