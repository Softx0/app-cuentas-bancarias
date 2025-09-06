import { StyleProp, ViewStyle } from "react-native";

type HumanoButtonStyle = "full-radius" | "rounded";

type HumanoButtonHierarchy = "primary" | "secondary" | "secondaryGray" | "ghost" | "beware";

type HumanoButtonSize = "small" | "medium" | "large";

type HumanoButtonIconPosition = "left" | "right";

interface HumanoButtonProps {
  label?: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  buttonIcon?: HumanoButtonIcon;
  style?: HumanoButtonStyle;
  hierarchy?: HumanoButtonHierarchy;
  size?: HumanoButtonSize;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface HumanoButtonIcon {
  position: HumanoButtonIconPosition;
  icon: React.JSX.Element;
}
