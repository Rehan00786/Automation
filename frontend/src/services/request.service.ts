import { api } from "./api";

export type AccessRequest = {
  id: string;
  status: string;
  requested_for: string;
};

export const requestService = {
  async list(): Promise<AccessRequest[]> {
    const { data } = await api.get<AccessRequest[]>("/requests");
    return data;
  },
};
