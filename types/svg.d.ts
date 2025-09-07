/**
 * SVG TypeScript Declarations
 * Enables importing .svg files as React components
 */

declare module "*.svg" {
  import React from "react";
    import { SvgProps } from "react-native-svg";
  
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.svg?url" {
  const content: string;
  export default content;
}

declare module "*.svg?react" {
  import React from "react";
    import { SvgProps } from "react-native-svg";
  
  const content: React.FC<SvgProps>;
  export default content;
}

// Global SVG component type for better IntelliSense
declare global {
  namespace JSX {
    interface IntrinsicElements {
      svg: React.SVGProps<SVGSVGElement>;
    }
  }
}

export { };

