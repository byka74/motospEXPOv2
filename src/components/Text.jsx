import { Text as ReactText } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  ReduceMotion,
  useSharedValue,
  cubicBezier,
} from 'react-native-reanimated';

import { useThemeStore } from '../zustand/context';
import { useEffect, useMemo, memo } from 'react';

const AnimatedReactText = Animated.createAnimatedComponent(ReactText);

export const Text = memo(
  /**
   * @typedef {import('react-native').TextProps} ReactTextProps
   * @typedef {import('react-native').TextStyle} TextStyle
   * @typedef {object} CustomTextExtraProps
   * @property {TextStyle} [animate] - Текстийн анимейшн эсвэл динамик стиль объект
   * @property {number} [duration] - Хугацаа (ms)
   * @property {boolean} [syncLight] - Темийн синхрончлол
   * @typedef {ReactTextProps & CustomTextExtraProps} TextComponentProps
   */

  /**
   * @param {TextComponentProps} props
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

    // Стилийн тооцооллыг useMemo-д багтаавал илүү цэвэрхэн
    const memoizedStyle = useMemo(() => {
      const mergeStyle = { ...style, ...animate };

      const defaultStyle = {
        fontSize: 12,
        lineHeight: mergeStyle.fontSize ? mergeStyle.fontSize * 1.1 : 12 * 1.1,
        includeFontPadding: false,
        fontFamily: mergeStyle.fontFamily ? mergeStyle.fontFamily : 'Regular',
      };

      const finalStyle = { ...defaultStyle, ...mergeStyle };

      finalStyle.includeFontPadding = false;

      if (syncLight) {
        finalStyle.color = isLight ? 'rgb(0, 0, 0)' : 'rgb(255,255,255)';
      }

      // Сүүлийн ирсэн color утга өмнөхүүдийг дарна
      if (typeof style?.color === 'string') finalStyle.color = style.color;
      if (typeof animate?.color === 'string') finalStyle.color = animate.color;

      return finalStyle;
    }, [style, animate, isLight, syncLight]);

    const transitionProperty = useMemo(() => {
      if (!animate) return ['none'];
      if (typeof animate === 'object') return Object.keys(animate);
      return animate === true ? ['all'] : ['none'];
    }, [animate]);

    return (
      <AnimatedReactText
        style={[
          memoizedStyle,
          animate != null && {
            transitionProperty,
            transitionDuration: duration ?? 0,
            transitionTimingFunction: cubicBezier(0.2, 0.7, 0.3, 1),
          },
        ]}
        {...restProps}
      >
        {children}
      </AnimatedReactText>
    );
  }
);

Text.displayName = 'CustomTextComponent';
