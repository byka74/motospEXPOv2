import { TextInput as ReactTextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  ReduceMotion,
  useSharedValue,
  cubicBezier,
} from 'react-native-reanimated';
import { useEffect, useState, useRef, useMemo, memo } from 'react';

import { useThemeStore } from '../zustand/context';
import { Text } from './Text';

const AnimatedTextInput = Animated.createAnimatedComponent(ReactTextInput);
const AnimatedView = Animated.createAnimatedComponent(View);

export const TextInput = memo(
  /**
   * @typedef {import('react-native').TextInputProps} ReactTextInputProps
   * @typedef {import('react-native').TextStyle} TextStyle
   * @typedef {object} CustomTextInputExtraProps
   * @property {TextStyle} [animate] - Текстийн анимэйшн эсвэл динамик стиль объект
   * @property {TextStyle} [stylePlaceholder] - Текстийн плэйсхолдер анимэйшн эсвэл динамик стиль объект
   * @property {TextStyle} [animatePlaceholder] - Текстийн плэйсхолдер анимэйшн эсвэл динамик стиль объект
   * @property {number} [duration] - Хугацаа (ms)
   * @property {number} [durationPlaceholder] - Хугацаа (ms)
   * @property {boolean} [syncLight] - Темийн синхрончлол
   */
  /**
   * @typedef {ReactTextInputProps & CustomTextInputExtraProps} TextInputComponentProps
   */
  /**
   * @param {TextInputComponentProps} props
   */
  (props) => {
    const {
      style = null,
      animate = null,
      stylePlaceholder = null,
      animatePlaceholder = null,
      durationPlaceholder = null,
      placeholderTextColor,
      placeholder,
      children,
      duration = null,
      onBlur = () => {},
      onFocus = () => {},
      onChangeText = (text) => {},
      syncLight,
      ...restProps
    } = props;

    const isLight = useThemeStore((state) => state.isLight);
    const [isFocus, setFocus] = useState(false);
    const value = useRef('');

    // Стилийн тооцооллыг useMemo-д багтаавал илүү цэвэрхэн
    const memoizedLayoutStyle = useMemo(() => {
      const popList = [
        'paddingVertical',
        'paddingHorizontal',
        'padding',
        'paddingBlock',
        'paddingBlockEnd',
        'paddingBlockStart',
        'paddingBottom',
        'paddingEnd',
        'paddingInline',
        'paddingInlineEnd',
        'paddingInlineStart',
        'paddingLeft',
        'paddingRight',
        'paddingStart',
        'paddingTop',
      ];

      const styleSecond = style;
      const animateSecond = animate;

      popList.forEach((list, index) => {
        if (
          styleSecond != null &&
          typeof styleSecond === 'object' &&
          styleSecond[list] != null
        )
          styleSecond[list] = 0;
        if (
          animateSecond != null &&
          typeof animateSecond === 'object' &&
          animateSecond[list] != null
        )
          animateSecond[list] = 0;
      });


      const finalStyle = { ...styleSecond, ...animateSecond };

      if (syncLight) {
        finalStyle.backgroundColor = isLight
          ? 'rgb(240,240,240)'
          : 'rgb(80, 80, 80)';
      }

      return finalStyle;
    }, [style, animate, isLight, syncLight]);

    // Стилийн тооцооллыг useMemo-д багтаавал илүү цэвэрхэн
    const memoizedTextStyle = useMemo(() => {
      const finalStyle = { ...style, ...animate };

      finalStyle.fontSize = 12;

      if (syncLight) {
        finalStyle.color = isLight ? 'rgb(0, 0, 0)' : 'rgb(255,255,255)';
      }

      // Сүүлийн ирсэн color утга өмнөхүүдийг дарна
      if (typeof style?.color === 'string') finalStyle.color = style.color;
      if (typeof animate?.color === 'string') finalStyle.color = animate.color;
      if (typeof style?.fontSize === 'number')
        finalStyle.fontSize = style.fontSize;
      if (typeof animate?.fontSize === 'number')
        finalStyle.fontSize = animate.fontSize;

      finalStyle.fontFamily = finalStyle.fontFamily ?? 'Regular';
      finalStyle.includeFontPadding = false;
      if (finalStyle?.lineHeight == null)
        finalStyle.lineHeight = finalStyle.fontSize;

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
          {
            overflow: 'hidden',
          },
          animate != null && {
            transitionProperty,
            transitionDuration: duration ?? 0,
            transitionTimingFunction: cubicBezier(0.2, 0.7, 0.3, 1),
          },
        ]}
      >
        <Text
          style={{
            position: 'relative',
            overflow: 'hidden',
            height: 0,
            opacity: 0,
            paddingHorizontal: 25,
          }}
        >
          {placeholder}
        </Text>
        <AnimatedTextInput
          style={[
            memoizedTextStyle,
            {
              paddingHorizontal: 25,
              fontSize: 12,
              lineHeight: 12,
              paddingTop: isFocus ? 30 : 25,
              paddingBottom: isFocus ? 20 : 25,
            },
            animate != null && {
              transitionProperty,
              transitionDuration: duration ?? 0,
              transitionTimingFunction: cubicBezier(0.2, 0.7, 0.3, 1),
            },
          ]}
          placeholder={placeholder}
          includeFontPadding={false}
          onChangeText={(text) => {
            value.current = text;
            onChangeText(text);
            console.log(placeholder);
          }}
          onFocus={() => {
            setFocus(true);
            onFocus();
          }}
          onBlur={(e) => {
            if (value.current.length === 0) setFocus(false);
            onBlur();
          }}
          placeholderTextColor={'rgba(0,0,0,0)'}
          {...restProps}
        >
          {children}
        </AnimatedTextInput>
        <Text
          style={{
            fontFamily: memoizedTextStyle.fontFamily,
            color:
              placeholderTextColor ?? syncLight === true
                ? isLight
                  ? 'rgb(0,0,0)'
                  : 'rgb(255,255,255)'
                : 'rgb(0,0,0)',
            position: 'absolute',
            transformOrigin: 'left top',
          }}
          animate={{
            opacity: isFocus ? 0.5 : 1,
            transform: [
              { translateX: 25 },
              { translateY: isFocus ? 15 : '200%' },
              { scale: isFocus ? 0.85 : 1 },
            ],
          }}
          duration={500}
        >
          {placeholder}
        </Text>
      </AnimatedView>
    );
  }
);

TextInput.displayName = 'CustomTextInputComponent';
