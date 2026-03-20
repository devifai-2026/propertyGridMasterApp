import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface VerifiedSvgProps {
  color?: string;
  width?: number | string;
  height?: number | string;
}

const VerifiedSvg: React.FC<VerifiedSvgProps> = ({ 
  color = "#EE2529", 
  width = 108, 
  height = 30 
}) => {
  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox="0 0 108 30" 
      fill="none"
    >
      <Path 
        d="M14.5431 2.10627C15.4808 0.785022 17.0005 0 18.6207 0H107.345V29.1806H5.00864C0.948767 29.1806 -1.41853 24.5977 0.931108 21.2868L14.5431 2.10627Z" 
        fill={color}
      />
    </Svg>
  );
};

export default VerifiedSvg;