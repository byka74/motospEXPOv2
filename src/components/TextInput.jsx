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
          style={[{ padding: 25, fontSize: 12, lineHeight: 12 }]}
          placeholder={placeholder}
          includeFontPadding={false}
          onChangeText={(text) => {
            value.current = text;
            onChangeText(text);
          }}
          onFocus={() => {
            setFocus(true);
            onFocus();
          }}
          onBlur={(e) => {
            if(value.current.length === 0)
            setFocus(false);
            onBlur();
          }}
          placeholderTextColor={'rgba(0,0,0,0)'}
          {...restProps}
        >
          {children}
        </AnimatedTextInput>
        <Text
          style={{
            position: 'absolute',
            fontSize: 12,
            transformOrigin: 'left top',
          }}
          animate={{
            transform: [
              { translateX: 25 },
              { translateY: isFocus ? 10 : 25 },
              { scale: isFocus ? 0.75 : 1 },
            ],
          }}
          duration={500}
        >
          {placeholder}
        </Text>
      </AnimatedView>
    );
  },
);

TextInput.displayName = 'CustomTextInputComponent';
