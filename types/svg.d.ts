/**
 * SVG TypeScript Declarations for React Native
 * Enables importing .svg files as React components using react-native-svg-transformer
 */

declare module "*.svg" {
  import { FC } from "react";
    import { SvgProps } from "react-native-svg";
  const content: FC<SvgProps>;
  export default content;
}

declare module "*.svg?url" {
  const content: string;
  export default content;
}

declare module "*.svg?react" {
  import { FC } from "react";
    import { SvgProps } from "react-native-svg";
  const content: FC<SvgProps>;
  export default content;
}

