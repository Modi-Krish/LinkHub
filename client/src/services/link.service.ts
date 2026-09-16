import { api } from "./api";

export const getLinks = async (page = 1, limit = 10, search = "") => {
  const response = await api.get("/links", {
    params: { page, limit, search },
  });
  return response.data.data;
};

export const getLink = async (id: string) => {
  const response = await api.get(`/links/${id}`);
  return response.data.data;
};

export const createLink = async (data: { destinationUrl: string; customSlug?: string }) => {
  const response = await api.post("/links", data);
  return response.data.data;
};

export const deleteLink = async (id: string) => {
  await api.delete(`/links/${id}`);
};
