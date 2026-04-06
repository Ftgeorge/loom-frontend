import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  colorClass?: string;
  iconColor?: string;
  className?: string;
}

export function SettingItem({
  icon,
  label,
  value,
  onPress,
  isLast = false,
  colorClass = "bg-primary/10",
  iconColor = "#00120C",
  className = "",
}: SettingItemProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center py-6 px-8 bg-white ${
        !isLast ? "border-b border-card-border/30" : ""
      } active:bg-gray-50 ${className}`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        className={`w-12 h-12 rounded-2xl items-center justify-center mr-5 shadow-inner border border-card-border/50 ${colorClass}`}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-jakarta-extrabold text-ink uppercase italic tracking-tighter">
          {label}
        </Text>
        {value && (
          <Text
            className="text-[12px] text-ink/40 mt-1.5 normal-case italic font-jakarta-medium"
            numberOfLines={1}
          >
            {value}
          </Text>
        )}
      </View>
      {onPress && <Ionicons name="chevron-forward" size={18} color="#94A3B8" />}
    </TouchableOpacity>
  );
}
