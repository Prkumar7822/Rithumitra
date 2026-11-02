import React from 'react';
import { SvgProps } from 'react-native-svg';

export interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: React.FC<SvgProps>;
}
