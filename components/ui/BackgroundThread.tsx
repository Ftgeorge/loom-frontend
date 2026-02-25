import { Colors } from '@/theme';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function BackgroundThread() {
    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none" className="z-[-10]">
            <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
                <Defs>
                    <LinearGradient id="threadGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor={Colors.primary} stopOpacity="0.4" />
                        <Stop offset="0.5" stopColor={Colors.primary} stopOpacity="0.1" />
                        <Stop offset="1" stopColor={Colors.success || Colors.primary} stopOpacity="0.05" />
                    </LinearGradient>
                </Defs>
                <Path
                    d={`M -50,${height * 0.2} C ${width * 0.4},${height * 0.1} ${width * 0.6},${height * 0.8} ${width + 50},${height * 0.6}`}
                    fill="none"
                    stroke="url(#threadGrad)"
                    strokeWidth="3"
                />
                <Path
                    d={`M -50,${height * 0.6} C ${width * 0.3},${height * 0.8} ${width * 0.7},${height * 0.2} ${width + 50},${height * 0.4}`}
                    fill="none"
                    stroke="url(#threadGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                />
            </Svg>
        </View>
    );
}
