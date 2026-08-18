import { API_BASE_URL, ENDPOINTS } from './apiConfig';
import { 
  GenerateOtpRequest, 
  GenerateOtpResponse, 
  VerifyOtpRequest, 
  VerifyOtpResponse 
} from '../models/apiTypes';

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default timeout to 15 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  console.log(`\n[API REQUEST] ${options.method || 'GET'} ${url}`);
  if (options.body) {
    console.log(`[API PAYLOAD]`, options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    console.log(`[API RESPONSE STATUS]`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`[API RAW ERROR TEXT]`, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = {};
      }

      const errorMessage = errorData?.detail 
        ? (Array.isArray(errorData.detail) ? errorData.detail[0]?.msg : (typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail))) 
        : `An error occurred (HTTP ${response.status})`;
        
      console.log(`[API PARSED ERROR]`, errorMessage);
      throw new ApiError(errorMessage);
    }

    const jsonResponse = await response.json();
    console.log(`[API SUCCESS RESPONSE]`, JSON.stringify(jsonResponse, null, 2));
    return jsonResponse;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError' || error.message?.includes('Network request failed') || error.message?.includes('timeout')) {
      throw new ApiError('Network request failed or timed out. Please check your internet connection.');
    }
    throw new ApiError(error.message || 'An unexpected network error occurred');
  }
};

export const generateOtp = async (mobileNumber: string): Promise<GenerateOtpResponse> => {
  const payload: GenerateOtpRequest = { mobile_number: mobileNumber };
  return request<GenerateOtpResponse>(ENDPOINTS.GENERATE_OTP, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const verifyOtp = async (mobileNumber: string, otpCode: string): Promise<VerifyOtpResponse> => {
  const payload: VerifyOtpRequest = { 
    mobile_number: mobileNumber, 
    otp_code: otpCode,
    phone_id: "",
    phone_info: ""
  };
  
  return request<VerifyOtpResponse>(ENDPOINTS.VERIFY_OTP, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
