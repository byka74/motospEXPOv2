import { View as ReactView } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  ReduceMotion,
  useSharedValue,
  cubicBezier,
} from 'react-native-reanimated';
import { useEffect, useState, useRef, useMemo, memo } from 'react';

import { useThemeStore } from '../zustand/context';

const AnimatedView = Animated.createAnimatedComponent(ReactView);

export const View = memo(
  /**
   * @typedef {import('react-native').ViewProps} ReactViewProps
   * @typedef {object} CustomViewProps
   * @property {ReactViewProps} [style] - Текстийн анимэйшн эсвэл динамик стиль объект
   * @property {ReactViewProps} [animate] - Текстийн анимэйшн эсвэл динамик стиль объект
   * @property {number} [duration] - Хугацаа (ms)
   * @property {boolean} [syncLight] - Темийн синхрончлол
   */
  /**
   * @typedef {ReactViewProps & CustomViewProps} ViewComponentProps
   */
  /**
   * @param {ViewComponentProps} props
   */
  (props) => {
    const { style, animate, children, duration, syncLight, ...restProps } =
      props;

    const isLight = useThemeStore((state) => state.isLight);

    const memoizedLayoutStyle = useMemo(() => {
      const styleSecond = style;
      const animateSecond = animate;

      const finalStyle = { ...styleSecond, ...animateSecond };

      if (syncLight) {
        finalStyle.backgroundColor = isLight
          ? 'rgb(255,255,255)'
          : 'rgb(50, 50, 50)';
      }

      return finalStyle;
    }, [style, animate, isLight, syncLight]);

    const transitionProperty = useMemo(() => {
      if (!animate) return ['none'];
      if (typeof animate === 'object') return Object.keys(animate);
      return animate === true ? ['all'] : ['none'];
    }, [animate]);

    return (
      <AnimatedView
        style={[
          memoizedLayoutStyle,
          animate != null && {
            transitionProperty,
            transitionDuration: duration ?? 0,
            transitionTimingFunction: cubicBezier(0.2, 0.7, 0.3, 1),
          },
        ]}
        {...restProps}
      >
        {children}
      </AnimatedView>
    );
  },
);

View.displayName = 'CustomView';
