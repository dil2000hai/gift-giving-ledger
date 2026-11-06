import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

type Props = {
  color: string;
  size?: number;
  hollow?: boolean;
};

/** A 14x14 gift box with a cross ribbon — the calendar's occasion marker. */
function GiftBoxMarkerBase({ color, size = 14, hollow = false }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Rect
        x={1}
        y={2.5}
        width={12}
        height={10}
        rx={2.5}
        fill={hollow ? 'none' : color}
        stroke={color}
        strokeWidth={hollow ? 1.4 : 0}
      />
      {hollow ? null : (
        <Path d="M7 2.5 V12.5 M1 6.6 H13" stroke="#FFFFFF" strokeWidth={1.4} opacity={0.9} />
      )}
    </Svg>
  );
}

export const GiftBoxMarker = React.memo(GiftBoxMarkerBase);
export default GiftBoxMarker;
