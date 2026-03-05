/**
 * LoomThread – animated, decorative thread curves for backgrounds.
 *
 * Usage:
 *   <LoomThread />                        // default – two subtle diagonal threads
 *   <LoomThread variant="dense" />        // three threads, dashed + solid
 *   <LoomThread variant="minimal" />      // single thin thread
 *   <LoomThread color="#F59E0B" />         // custom color override
 *   <LoomThread animated={false} />       // static, no motion
 *
 * The component renders as an absolutely-positioned overlay with pointerEvents="none"
 * so it never blocks touches.  Drop it inside any container or at screen level.
 */

import { Colors } from "@/theme";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedProps,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import Svg, {
    Defs,
    LinearGradient,
    Path,
    Stop,
} from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width: W, height: H } = Dimensions.get("window");

/* ---------- thread path generators ---------- */

const threadPaths = {
    /** Two crossing arcs – the default look */
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

    /** Three threads for busier screens */
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

    /** Single delicate arc */
    minimal: [
        {
            d: `M -40,${H * 0.3} C ${W * 0.4},${H * 0.15} ${W * 0.6},${H * 0.85} ${W + 40},${H * 0.7}`,
            strokeWidth: 1.5,
            dasharray: undefined as string | undefined,
        },
    ],

    /** Complex variant with more motion and threads */
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
};

/* ---------- animated single path ---------- */

function AnimatedThread({
    d,
    strokeWidth,
    dasharray,
    gradientId,
    delay,
    animated,
}: {
    d: string;
    strokeWidth: number;
    dasharray?: string;
    gradientId: string;
    delay: number;
    animated: boolean;
}) {
    const progress = useSharedValue(0);

    useEffect(() => {
        if (animated) {
            progress.value = withDelay(
                delay,
                withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) }),
            );
        } else {
            progress.value = 1;
        }
    }, []);

    const animatedProps = useAnimatedProps(() => ({
        strokeOpacity: interpolate(progress.value, [0, 1], [0, 1]),
    }));

    return (
        <AnimatedPath
            d={d}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={dasharray}
            strokeLinecap="round"
            animatedProps={animatedProps}
        />
    );
}

/* ---------- main component ---------- */

export type LoomThreadVariant = "default" | "dense" | "minimal" | "complex";

interface LoomThreadProps {
    /** Visual variant – controls number and style of threads */
    variant?: LoomThreadVariant;
    /** Base colour for the gradient (defaults to primary) */
    color?: string;
    /** Secondary colour at the tail of the gradient */
    colorEnd?: string;
    /** Overall opacity multiplier (0 – 1, default 1) */
    opacity?: number;
    /** Whether threads fade in on mount (default true) */
    animated?: boolean;
    /** Scaling factor for the paths */
    scale?: number;
}

export function LoomThread({
    variant = "default",
    color,
    colorEnd,
    opacity = 1,
    animated = true,
    scale = 1,
}: LoomThreadProps) {
    const baseColor = color ?? Colors.primary;
    const endColor = colorEnd ?? Colors.accent;
    const paths = threadPaths[variant];
    const gradId = `loomGrad_${variant}`;

    return (
        <View
            style={[
                StyleSheet.absoluteFillObject,
                {
                    opacity,
                    zIndex: -10,
                    transform: [{ scale }]
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
                        key={i}
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
}

