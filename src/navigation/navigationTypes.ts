export type RootStackParamList = {
  Onboarding: undefined;
  LanguageSelection: undefined;
  Login: undefined;
  VerifyOTP: { mobileNumber: string };
  ProfileSetup: { farmer: Record<string, any> };
  Dashboard: { farmer: Record<string, any>; fields: any[] };
};
