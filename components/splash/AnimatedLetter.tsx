import React, { useEffect } from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

const LETTER_DELAY = 80;

interface AnimatedLetterProps {
  letter: string;
  index: number;
}

export function AnimatedLetter({
  letter,
  index,
}: AnimatedLetterProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * LETTER_DELAY,
      withSpring(1, {
        damping: 15, stiffness: 100, mass: 1,
      })
    );
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.7, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [40, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.8, 1]) },
    ],
  }));

  return (
    <Animated.Text
      style={animatedStyle}
      className={`font-jakarta-extrabold italic text-[88px] text-white tracking-[-5px] ${index === 0 ? 'text-white' : 'text-white/90'}`}
    >
      {letter}
    </Animated.Text>
  );
}
