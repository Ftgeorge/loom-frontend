import { Colors } from "@/theme";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedProps,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, {
    Defs,
    G,
    LinearGradient,
    Path,
    Stop,
} from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

/* ---------- thread path generators ---------- */

const getThreadPaths = (W: number, H: number) => ({
    default: [
        {
            d: `M -40,${H * 0.15} C ${W * 0.35},${H * 0.05} ${W * 0.55},${H * 0.75} ${W + 40},${H * 0.55}`,
            strokeWidth: 2.5,
            dasharray: undefined as string | undefined,
        },
        {
            d: `M -40,${H * 0.65} C ${W * 0.25},${H * 0.85} ${W * 0.75},${H * 0.15} ${W + 40},${H * 0.35}`,
            strokeWidth: 1.5,
            dasharray: "6 10",
        },
    ],
    dense: [
        {
            d: `M -40,${H * 0.1} C ${W * 0.5},${H * 0.0} ${W * 0.3},${H * 0.6} ${W + 40},${H * 0.45}`,
            strokeWidth: 2,
            dasharray: undefined as string | undefined,
        },
        {
            d: `M -40,${H * 0.5} C ${W * 0.2},${H * 0.7} ${W * 0.8},${H * 0.3} ${W + 40},${H * 0.6}`,
            strokeWidth: 1.2,
            dasharray: "4 8",
        },
        {
            d: `M -40,${H * 0.85} C ${W * 0.6},${H * 0.95} ${W * 0.4},${H * 0.4} ${W + 40},${H * 0.25}`,
            strokeWidth: 1,
            dasharray: "3 6",
        },
    ],
    minimal: [
        {
            d: `M -40,${H * 0.3} C ${W * 0.4},${H * 0.15} ${W * 0.6},${H * 0.85} ${W + 40},${H * 0.7}`,
            strokeWidth: 1.5,
            dasharray: undefined as string | undefined,
        },
    ],
    complex: [
        {
            d: `M -40,${H * 0.1} C ${W * 0.3},${H * 0.1} ${W * 0.2},0.8 ${W + 40},${H * 0.2}`,
            strokeWidth: 2,
            dasharray: undefined as string | undefined,
        },
        {
            d: `M -40,${H * 0.4} C ${W * 0.7},${H * 0.2} ${W * 0.4},${H * 0.9} ${W + 40},${H * 0.6}`,
            strokeWidth: 1,
            dasharray: "5 5",
        },
        {
            d: `M -40,${H * 0.9} C ${W * 0.1},${H * 0.5} ${W * 0.9},${H * 0.5} ${W + 40},${H * 0.1}`,
            strokeWidth: 1.5,
            dasharray: "10 10",
        },
        {
            d: `M 0,${H + 20} C ${W * 0.5},${H * 0.5} ${W * 0.2},${H * 0.2} ${W + 40},-20`,
            strokeWidth: 0.8,
            dasharray: undefined as string | undefined,
        }
    ]
});

/* ---------- animated single path ---------- */

function AnimatedThread({
    d,
    strokeWidth,
    dasharray,
    gradientId,
    delay,
    animated,
    index
}: {
    d: string;
    strokeWidth: number;
    dasharray?: string;
    gradientId: string;
    delay: number;
    animated: boolean;
    index: number;
}) {
    const progress = useSharedValue(0);
    const float = useSharedValue(0);

    useEffect(() => {
        if (animated) {
            progress.value = withDelay(
                delay,
                withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) }),
            );

            float.value = withDelay(
                delay + 1000,
                withRepeat(
                    withTiming(1, {
                        duration: 6000 + (index * 1000),
                        easing: Easing.inOut(Easing.sin)
                    }),
                    -1,
                    true
                )
            );
        } else {
            progress.value = 1;
        }
    }, [animated, delay, index]);

    const PATH_LENGTH = 2000;

    const animatedProps = useAnimatedProps(() => ({
        strokeOpacity: interpolate(progress.value, [0, 0.1, 1], [0, 1, 1]),
        strokeDashoffset: interpolate(progress.value, [0, 1], [PATH_LENGTH, 0]),
    }));

    const animatedGProps = useAnimatedProps(() => ({
        transform: [
            { translateY: interpolate(float.value, [0, 1], [-15, 15]) },
            { translateX: interpolate(float.value, [0, 1], [-5, 5]) },
        ],
    }));

    return (
        <AnimatedG animatedProps={animatedGProps}>
            <AnimatedPath
                d={d}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={strokeWidth}
                strokeDasharray={dasharray || PATH_LENGTH}
                strokeLinecap="round"
                animatedProps={animatedProps}
            />
        </AnimatedG>
    );
}

/* ---------- main component ---------- */

export type LoomThreadVariant = "default" | "dense" | "minimal" | "complex";

interface LoomThreadProps {
    variant?: LoomThreadVariant;
    color?: string;
    colorEnd?: string;
    opacity?: number;
    animated?: boolean;
    scale?: number;
}

export const LoomThread = React.memo(({
    variant = "default",
    color,
    colorEnd,
    opacity = 0.4, // Increased default opacity for visibility
    animated = true,
    scale = 1,
}: LoomThreadProps) => {
    const { width: W, height: H } = useWindowDimensions();
    const baseColor = color ?? Colors.primary;
    const endColor = colorEnd ?? Colors.accent;
    
    const paths = useMemo(() => getThreadPaths(W, H)[variant], [W, H, variant]);
    const gradId = `loomGrad_${variant}`;

    return (
        <View
            style={[
                StyleSheet.absoluteFillObject,
                {
                    opacity,
                    zIndex: 99, // Render on top but non-interactive to ensure visibility
                }
            ]}
            pointerEvents="none"
        >
            <Svg height="100%" width="100%" viewBox={`0 0 ${W} ${H}`}>
                <Defs>
                    <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor={baseColor} stopOpacity="0.8" />
                        <Stop offset="0.5" stopColor={baseColor} stopOpacity="0.45" />
                        <Stop offset="1" stopColor={endColor} stopOpacity="0.3" />
                    </LinearGradient>
                </Defs>

                {paths.map((p, i) => (
                    <AnimatedThread
                        key={`${W}-${H}-${i}`}
                        index={i}
                        d={p.d}
                        strokeWidth={p.strokeWidth}
                        dasharray={p.dasharray}
                        gradientId={gradId}
                        delay={i * 300}
                        animated={animated}
                    />
                ))}
            </Svg>
        </View>
    );
});
