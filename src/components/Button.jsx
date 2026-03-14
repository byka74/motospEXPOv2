import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  ReduceMotion,
  useSharedValue,
  cubicBezier,
} from 'react-native-reanimated';
import { useEffect, useState, useRef, useMemo, memo } from 'react';

import { useThemeStore } from '../zustand/context';

const AnimatedPressble = Animated.createAnimatedComponent(Pressable);

/**
 * @typedef {object} CustomButtonProps
 * @property {boolean} syncLight - Темийн синхрончлол
 * @property {number} duration - Хугацаа (ms)
 * @property {import('react-native').ViewStyle} animate - ViewStyle-тэй ижил бүтэцтэй анимэйшн стиль
 */

/**
 * @typedef { import('react-native').PressableProps & CustomButtonProps} ButtonProps
 */

export const Button = memo(
  /**
   * @param {ButtonProps} props
   */
  (props) => {
    const {
      style = null,
      animate,
      children,
      duration = null,
      syncLight,
      ...restProps
    } = props;

    const isLight = useThemeStore((state) => state.isLight);

    const memoizedLayoutStyle = useMemo(() => {
      const styleSecond = style;
      const animateSecond = animate;

      const finalStyle = { ...styleSecond, ...animateSecond };

      if (syncLight) {
        finalStyle.backgroundColor = isLight
          ? 'rgb(240,240,240)'
          : 'rgb(80, 80, 80)';
      }
      return finalStyle;
    }, [style, animate, isLight, syncLight]);

    const transitionProperty = useMemo(() => {
      if (!animate) return ['none'];
      if (typeof animate === 'object') return Object.keys(animate);
      return animate === true ? ['all'] : ['none'];
    }, [animate]);

    return (
      <AnimatedPressble
        style={[
          memoizedLayoutStyle,
          {
            overflow: 'hidden',
          },
          animate != null && {
            transitionProperty,
            transitionDuration: duration ?? 0,
            transitionTimingFunction: cubicBezier(0.2, 0.7, 0.3, 1),
          },
        ]}
        {...restProps}
      >
        {children}
      </AnimatedPressble>
    );
  },
);

Button.displayName = 'CustomButton';
