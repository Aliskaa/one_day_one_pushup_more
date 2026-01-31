import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Text } from 'tamagui';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  fontSize?: number;
  fontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  fontSize = 32,
  fontWeight = '800',
  color = '$color',
  suffix = '',
  prefix = '',
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    animatedValue.addListener(({ value: animValue }) => {
      setDisplayValue(Math.round(animValue));
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [value]);

  return (
    <Text fontSize={fontSize} fontWeight={fontWeight} color={color}
                    fontFamily="$body">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </Text>
  );
};
