import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import type { SliderProps } from '@react-native-community/slider';

type WebSliderProps = SliderProps & {
  className?: string;
};

const isWeb = Platform.OS === 'web';

const NativeSlider: React.ComponentType<SliderProps> | null = isWeb
  ? null
  : // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@react-native-community/slider').default;

export const ResponsiveSlider = (props: WebSliderProps) => {
  if (isWeb) {
    const {
      minimumValue = 0,
      maximumValue = 1,
      step = 0,
      value = minimumValue,
      minimumTrackTintColor = '#2563eb',
      maximumTrackTintColor = '#e5e7eb',
      thumbTintColor = '#2563eb',
      onValueChange,
      onSlidingComplete,
      style,
    } = props;

    const flattened = StyleSheet.flatten(style);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = Number(event.target.value);
      onValueChange?.(numericValue);
    };

    const handleComplete = (event: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = Number(event.target.value);
      onSlidingComplete?.(numericValue);
    };

    return (
      <input
        type="range"
        min={minimumValue}
        max={maximumValue}
        step={step || 1}
        value={value}
        onChange={handleChange}
        onMouseUp={handleComplete}
        onTouchEnd={handleComplete}
        style={{
          width: '100%',
          accentColor: thumbTintColor ?? minimumTrackTintColor,
          backgroundColor: maximumTrackTintColor,
          ...flattened,
        }}
      />
    );
  }

  if (!NativeSlider) {
    return null;
  }

  return <NativeSlider {...props} />;
};


