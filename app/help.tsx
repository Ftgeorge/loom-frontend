import { AppHeader } from "@/components/AppHeader";
import { PrimaryButton } from "@/components/ui/Buttons";
import { Card } from "@/components/ui/CardChipBadge";
import { AppTextInput } from "@/components/ui/TextInputs";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LoomThread } from "@/components/ui/LoomThread";

const FAQ_ITEMS = [
  {
    q: "HOW DO I FIND AN ARTISAN?",
    a: "Initialize the Search tab to browse professional operatives by sector, or deploy a mission request for system-wide matching.",
  },
  {
    q: "HOW DOES PAYMENT SYNC WORK?",
    a: "Settlement is currently handled through direct peer-to-peer transmission. Encrypted in-app credits protocol is currently in development.",
  },
  {
    q: "CAN I TOGGLE OPERATIONAL MODES?",
    a: "Affirmative. Navigate to Settings → Identity Matrix to switch between Client and Artisan operational roles.",
  },
  {
    q: "HOW ARE OPERATIVES VERIFIED?",
    a: "Artisans undergo a multi-layered identity scan. Verified operatives are marked with a high-fidelity tactical badge.",
  },
  {
    q: "WETIN HAPPEN IF MISSION FAIL?",
    a: "You can submit a post-operation report and rate the operative. If critical issues arise, contact Loom Command Support immediately.",
  },
  {
    q: "IS LOOM DEPLOYED OUTSIDE ABUJA?",
    a: "Loom is currently operational in Abuja, Lagos, and Port Harcourt. Expansion to further sectors is imminent.",
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [contactMsg, setContactMsg] = useState("");

  return (
    <View className="flex-1 bg-background">
      <View className="absolute inset-0">
        <LoomThread variant="minimal" opacity={0.2} animated scale={1.3} />
      </View>
      <AppHeader
        title="COMMAND SUPPORT"
        showBack
        onBack={() => router.back()}
        showNotification={false}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 24, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.springify()} className="mb-10 px-1">
            <View className="flex-row items-center gap-2 mb-3">
                <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                <Text className="text-label text-primary tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">INTELLIGENCE HUB</Text>
            </View>
            <Text className="text-h1 text-[38px] leading-[40px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">TACTICAL FAQ</Text>
            <Text className="text-[15px] text-ink/60 mt-4 normal-case font-jakarta-medium italic leading-6">Search our intelligence database for common operational queries.</Text>
        </Animated.View>

        <View className="gap-4">
            {FAQ_ITEMS.map((item, i) => (
                <Animated.View key={i} entering={FadeInUp.delay(i * 50).springify()}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setExpanded(expanded === i ? null : i)}
                        className={`bg-white rounded-[32px] border-[1.5px] shadow-xl overflow-hidden transition-all ${
                            expanded === i ? 'border-primary shadow-2xl' : 'border-card-border/50'
                        }`}
                    >
                        <View className="flex-row justify-between items-center p-7">
                            <Text className={`text-[13px] flex-1 mr-6 uppercase tracking-tight font-jakarta-extrabold italic ${expanded === i ? 'text-primary' : 'text-ink'}`}>
                                {item.q}
                            </Text>
                            <View className={`w-8 h-8 rounded-xl items-center justify-center border shadow-sm ${
                                expanded === i ? 'bg-primary border-primary/20' : 'bg-background border-card-border/50'
                            }`}>
                                <Ionicons
                                    name={expanded === i ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={expanded === i ? "white" : "#94A3B8"}
                                />
                            </View>
                        </View>
                        {expanded === i && (
                            <View className="px-7 pb-8 pt-2 border-t border-card-border/10">
                                <Text className="text-[14px] text-ink/60 leading-6 italic font-jakarta-medium">
                                    {item.a}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            ))}
        </View>

        <View className="mt-16 mb-8 px-1">
            <View className="flex-row items-center gap-2 mb-3">
                <View className="w-1.5 h-1.5 rounded-full bg-accent shadow-sm" />
                <Text className="text-label text-accent tracking-[6px] uppercase font-jakarta-extrabold italic text-[11px]">DIRECT TRANSMISSION</Text>
            </View>
            <Text className="text-h1 text-[38px] leading-[40px] uppercase italic font-jakarta-extrabold tracking-tighter text-ink">CONTACT LOG</Text>
            <Text className="text-[15px] text-ink/60 mt-4 normal-case font-jakarta-medium italic leading-6">Initialize a direct line to Loom Command support operatives.</Text>
        </View>

        <View className="p-10 bg-white rounded-[42px] border-[1.5px] border-card-border/50 shadow-2xl mb-12">
            <AppTextInput
                placeholder="DESCRIBE YOUR CURRENT OPERATIONAL ISSUE..."
                value={contactMsg}
                onChangeText={setContactMsg}
                multiline
                numberOfLines={4}
                className="min-h-[160px] p-8 rounded-[32px] bg-background border-card-border/50 text-ink/80 italic font-jakarta-medium shadow-inner"
                style={{ textAlignVertical: "top" }}
            />
            <PrimaryButton
                title="SEND TRANSMISSION"
                onPress={() => {
                    setContactMsg("");
                }}
                disabled={!contactMsg.trim()}
                variant="accent"
                className="mt-8 h-18 rounded-3xl shadow-xl border border-white/10"
            />
        </View>

        <View className="gap-5 px-1">
            <TouchableOpacity activeOpacity={0.8} className="flex-row items-center gap-5 bg-white p-6 rounded-3xl border-[1.5px] border-card-border/50 shadow-xl active:bg-gray-50">
                <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center border border-primary/20 shadow-inner">
                    <Ionicons name="mail-outline" size={20} color="#078365" />
                </View>
                <View>
                    <Text className="text-label text-primary text-[9px] uppercase font-jakarta-extrabold italic tracking-[3px] mb-1">EMAIL GATEWAY</Text>
                    <Text className="text-[16px] text-ink font-jakarta-extrabold italic tracking-tight">SUPPORT@LOOM.NG</Text>
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={0.8} className="flex-row items-center gap-5 bg-white p-6 rounded-3xl border-[1.5px] border-card-border/50 shadow-xl active:bg-gray-50">
                <View className="w-12 h-12 rounded-2xl bg-info/10 items-center justify-center border border-info/20 shadow-inner">
                    <Ionicons name="call-outline" size={20} color="#3B82F6" />
                </View>
                <View>
                    <Text className="text-label text-info text-[9px] uppercase font-jakarta-extrabold italic tracking-[3px] mb-1">VOICE TERMINAL</Text>
                    <Text className="text-[16px] text-ink font-jakarta-extrabold italic tracking-tight">+234 901 234 5678</Text>
                </View>
            </TouchableOpacity>
        </View>
        
        <View className="mt-16 items-center opacity-20 pointer-events-none">
            <Text className="text-[9px] text-muted uppercase tracking-[5px] font-jakarta-bold italic">Loom Command Support Hub • v4.2.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
