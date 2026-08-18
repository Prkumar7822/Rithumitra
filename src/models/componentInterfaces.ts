import { Animated, ViewStyle, TextStyle } from 'react-native';

export interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  style?: ViewStyle;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface PaginatorProps {
  data: any[];
  scrollX: Animated.Value;
  hideFirst?: boolean;
}
