import { api } from "./api";
import { Child, ChildProfile, PaginatedChildrenResponse } from "@/types";

export const childrenAPI = {
  getChildren: async (): Promise<PaginatedChildrenResponse> => {
    try {
      const response = await api.get("/children/");
      return response.data;
    } catch (error) {
      return { results: [], count: 0 }; // Return an empty array on error to avoid breaking the app
    }
  },

  createChild: async (childData: ChildProfile): Promise<Child> => {
    try {
      const response = await api.post("/children/", childData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create child profile");
    }
  },

  updateChild: async (
    id: string,
    childData: Partial<Child>
  ): Promise<Child> => {
    try {
      const response = await api.patch(`/children/${id}/`, childData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update child profile");
    }
  },

  deleteChild: async (id: string): Promise<void> => {
    try {
      await api.delete(`/children/${id}/`);
    } catch (error) {
      throw new Error("Failed to delete child profile");
    }
  },
};
