import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const Checkbox = ({ checked, onChange, size = 24, color = '#ff1119' }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 300 });
  }, [checked]);

  // Зураасыг "зурах" эффект (SVG Path Length)
  const animatedPathProps = useAnimatedProps(() => ({
    strokeDashoffset: 16 * (1 - progress.value),
    strokeOpacity: interpolate(
      progress.value,
      [0, 1],
      [0, 1],
    ),
  }));

  // Хүрээний өнгө солигдох эффект
  const animatedRectProps = useAnimatedProps(() => ({
    stroke: interpolateColor(
      progress.value,
      [0, 1],
      ['#aaaaaa', color], // Gray to Theme Color
    ),
    fill: interpolateColor(progress.value, [0, 1], ['transparent', color]),
  }));

  return (
    <Pressable>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Гадна хүрээ */}
        <AnimatedRect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          strokeWidth="2"
          animatedProps={animatedRectProps}
        />
        {/* Зөвлөх тэмдэг (Check Mark) */}
        <AnimatedPath
          d="M6 12l4 4 8-8"
          fill={'#ffffff00'}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="16" // Замын урт
          animatedProps={animatedPathProps}
        />
      </Svg>
    </Pressable>
  );
};

export default Checkbox;
