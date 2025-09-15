import { api } from "./api";
import { Session } from "@/types";

export const sessionsAPI = {
  getSessions: async (childId: string): Promise<Session[]> => {
    try {
      const response = await api.get(`/sessions/?child_id=${childId}`);
      return response.data;
    } catch (error) {
      return []; // Return an empty array on error to avoid breaking the app
    }
  },

  createSession: async (sessionData: Omit<Session, "id">): Promise<Session> => {
    try {
      const response = await api.post("/sessions/", sessionData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create session");
    }
  },

  updateSession: async (
    id: string,
    sessionData: Partial<Session>
  ): Promise<Session> => {
    try {
      const response = await api.patch(`/sessions/${id}/`, sessionData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update session");
    }
  },

  startSession: async (childId: string): Promise<Session> => {
    try {
      const response = await api.post(`/sessions/start/`, {
        child_id: childId,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to start session");
    }
  },

  endSession: async (sessionId) => {
    try {
      await api.post(`/sessions/${sessionId}/end`);
    } catch (error) {
      throw new Error("Failed to end session");
    }
  },
};
