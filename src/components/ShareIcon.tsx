import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ShareIconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
}

const ShareIcon: React.FC<ShareIconProps> = ({ size = 22, width, height, color = "#F2F2F2" }) => {
  const iconWidth = width || size;
  const iconHeight = height || (iconWidth * 16) / 20;
  
  return (
    <Svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 20 16"
      fill="none"
    >
      <Path
        d="M18.5596 7.00391L11.2168 12.958V10.0225L10.6992 10.04C6.34305 10.1906 2.67025 11.3815 0.517578 14.3984C0.393021 11.9838 0.974649 9.64434 2.31738 7.81348C3.91779 5.63128 6.6448 4.10639 10.7207 4.07324L11.2168 4.06934V1.0498L18.5596 7.00391Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </Svg>
  );
};

export default ShareIcon;
