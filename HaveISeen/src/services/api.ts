import axios from "axios";
import { LoginRequest, LoginResponse, ErrorResponse } from "../types/api";

const API_URL = "http://localhost:3000/api/users";

export const login = async (
  data: LoginRequest
): Promise<LoginResponse | ErrorResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, data);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
