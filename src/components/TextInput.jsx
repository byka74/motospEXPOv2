import {
  Text as ReactText,
  TextInput as ReactTextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  ReduceMotion,
  useSharedValue,
  cubicBezier,
} from 'react-native-reanimated';

import { useThemeStore } from '../zustand/context';
import { useEffect, useState, useRef, useMemo, memo } from 'react';

const AnimatedText = Animated.createAnimatedComponent(ReactText);
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
      placeholder,
      children,
      duration = null,
      onBlur = () => {},
      onFocus = () => {},
      syncLight,
      ...restProps
    } = props;

    const isLight = useThemeStore((state) => state.isLight);
    const [isFocus, setFocus] = useState(false);

    return (
      <AnimatedView
        style={[
          {
            backgroundColor: 'rgb(200,200,200)',
            overflow: 'hidden',
            borderRadius: 15,
          },
        ]}
      >
        <AnimatedTextInput
          style={[{ padding: 25, fontSize: 12 }]}
          placeholder={placeholder}
          onFocus={() => {
            setFocus(true);
            onFocus();
          }}
          onBlur={() => {
            setFocus(false);
            onBlur();
          }}
          placeholderTextColor={'rgba(0,0,0,0)'}
          {...restProps}
        >
          {children}
        </AnimatedTextInput>
        <AnimatedText
          style={[
            {
              position: 'absolute',
              fontSize: 12,
              transform: [
                { translateX: 25 },
                { translateY: isFocus ? 10 : 25 },
                { scale: isFocus ? 0.75 : 1 },
              ],
              transformOrigin: 'left top',
            },
          ]}
        >
          {placeholder}
        </AnimatedText>
      </AnimatedView>
    );
  }
);

TextInput.displayName = 'CustomTextInputComponent';
