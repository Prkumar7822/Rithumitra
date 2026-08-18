export interface GenerateOtpRequest {
  mobile_number: string;
}

export interface GenerateOtpResponse {
  success: boolean;
  message: string;
  expires_in_seconds: number;
}

export interface VerifyOtpRequest {
  mobile_number: string;
  otp_code: string;
  phone_id?: string | null;
  phone_info?: string | null;
}

export interface TokenBundle {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in_minutes: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  is_new_user: boolean;
  tokens: TokenBundle;
  farmer?: Record<string, any> | null;
  fields?: any[] | null;
}

export interface ApiError {
  detail: string | any[];
}
