import { LoomThread } from '@/components/ui/LoomThread';
import { useAppStore } from "@/store";
import { Colors, Radius, Shadows, Typography } from "@/theme";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from "react-native-reanimated";

const { width } = Dimensions.get('window');

const LETTERS = ["L", "o", "o", "m"];
const LETTER_DELAY = 80;
const TAGLINE_DELAY = 800;
const INDICATOR_DELAY = 1200;

function AnimatedLetter({
  letter,
  index,
}: {
  letter: string;
  index: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * LETTER_DELAY,
      withSpring(1, {
        damping: 15,
        stiffness: 100,
        mass: 1,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.7, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [40, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.8, 1]) },
    ],
  }));

  return (
    <Animated.Text
<<<<<<< HEAD
      style={animatedStyle}
      className={`font-jakarta-extrabold italic text-[88px] text-white tracking-[-5px] ${index === 0 ? 'text-white' : 'text-white/90'}`}
=======
      style={[styles.letter, animatedStyle]}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
    >
      {letter}
    </Animated.Text>
  );
}

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasCompletedOnboarding, user } = useAppStore();

  const taglineOpacity = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);

  useEffect(() => {
    taglineOpacity.value = withDelay(
      TAGLINE_DELAY,
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) }),
    );

    indicatorOpacity.value = withDelay(
      INDICATOR_DELAY,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) }),
    );

    // Auto-navigation timer (3.5 seconds)
    const timer = setTimeout(() => {
      handleContinue();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (isAuthenticated) {
      router.replace(
        user?.role === "artisan" ? "/(tabs)/dashboard" : "/(tabs)/home",
      );
    } else if (hasCompletedOnboarding) {
      router.replace("/role-selection");
    } else {
      router.replace("/onboarding");
    }
  };

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [
      { translateY: interpolate(taglineOpacity.value, [0, 1], [30, 0]) },
    ],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <LoomThread
          variant="complex"
<<<<<<< HEAD
          color="#FFFFFF" 
          opacity={0.18}
=======
          color={Colors.accent}
          opacity={0.15}
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
          animated
        />
      </View>

<<<<<<< HEAD
      <View className="items-center z-20">
        <View className="flex-row items-center mb-4">
=======
      <View style={styles.center}>
        <View style={styles.wordRow}>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
          {LETTERS.map((letter, i) => (
            <AnimatedLetter key={i} letter={letter} index={i} />
          ))}
        </View>

<<<<<<< HEAD
        <Animated.View style={taglineStyle}>
          <View className="flex-row items-center gap-4">
            <View className="h-[1.5px] w-6 bg-white/30 rounded-full" />
            <Text className="text-[10px] text-white font-jakarta-extrabold tracking-[6px] uppercase italic text-center">
              SERVICES SIMPLIFIED
            </Text>
            <View className="h-[1.5px] w-6 bg-white/30 rounded-full" />
          </View>
        </Animated.View>
      </View>

      <Animated.View style={indicatorStyle} className="absolute bottom-24 w-full px-12 items-center flex-row justify-center gap-4 z-10">
        <ActivityIndicator color="white" size="small" />
        <Text className="text-[9px] text-white/40 font-jakarta-extrabold italic tracking-[4px] uppercase">
          Initializing Frequency
        </Text>
=======
        <Animated.View style={[styles.taglineBox, taglineStyle]}>
          <View style={styles.labelLine} />
          <Text style={styles.tagline}>
            SERVICES. SIMPLIFIED.
          </Text>
          <View style={styles.labelLine} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, indicatorStyle]}>
        <ActivityIndicator color={Colors.white} size="small" style={{ marginBottom: 20 }} />
        <Text style={styles.version}>LOADING...</Text>
>>>>>>> parent of fa2c86a (refactor: migrate component styles from StyleSheet to Tailwind CSS classes across the entire application)
      </Animated.View>
      
      <View className="absolute bottom-12 items-center opacity-10">
          <Text className="text-[8px] text-white tracking-[2px] font-jakarta-bold italic">LOOM ECOSYSTEM v4.2 PROTOTYPE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    zIndex: 10,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  letter: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    fontSize: 84,
    color: Colors.white,
    letterSpacing: -6,
  },
  taglineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  labelLine: {
    height: 1,
    width: 20,
    backgroundColor: Colors.gray300,
    opacity: 0.5,
  },
  tagline: {
    fontSize: 9,
    color: Colors.gray300,
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  footer: {
    position: "absolute",
    bottom: 64,
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.white,
    height: 64,
    width: '100%',
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    ...Shadows.lg,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Bold",
    letterSpacing: 1,
  },
  btnIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  version: {
    marginTop: 24,
    fontSize: 8,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: "Inter-Medium",
    letterSpacing: 2,
  }
});



