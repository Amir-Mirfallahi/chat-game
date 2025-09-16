import { api } from "./api";
import { Analytics, PaginatedAnalyticsResponse } from "@/types";

export const analyticsAPI = {
  getAnalytics: async (
    childId: string
  ): Promise<PaginatedAnalyticsResponse> => {
    try {
      const response = await api.get("/analytics", {
        params: { child_id: childId },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to start session");
    }
  },
};
