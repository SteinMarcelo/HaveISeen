export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id:string;
  token: string;
  message: string;
}

export interface ErrorResponse {
  error: string;
}
