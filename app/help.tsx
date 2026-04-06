import { AppHeader } from "@/components/AppHeader";
import { PrimaryButton } from "@/components/ui/Buttons";
import { Card } from "@/components/ui/CardChipBadge";
import { AppTextInput } from "@/components/ui/TextInputs";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const FAQ_ITEMS = [
  {
    q: "How do I find an artisan?",
    a: "Use the Search tab to browse artisans by category, or post a job request and we'll match you with the best artisans near you.",
  },
  {
    q: "How does payment work?",
    a: "Payment is handled directly between you and the artisan. We recommend agreeing on a price before the job starts. In-app payment coming soon!",
  },
  {
    q: "Can I switch between Client and Artisan?",
    a: "Yes! Go to Settings → Switch Role. You can toggle between Client and Artisan modes anytime.",
  },
  {
    q: "How are artisans verified?",
    a: "Artisans can submit their ID for verification. Verified artisans have a green badge on their profile.",
  },
  {
    q: "Wetin happen if I no dey satisfied?",
    a: "You can rate and review the artisan after the job. If you have an issue, contact our support team and we go help you.",
  },
  {
    q: "Is Loom available outside Abuja?",
    a: "Currently we operate in Abuja, Lagos, and Port Harcourt. More cities dey come soon!",
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [contactMsg, setContactMsg] = useState("");

  return (
    <View className="flex-1 bg-background">
      <AppHeader
        title="Help & Support"
        showBack
        onBack={() => router.back()}
        showNotification={false}
      />

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-h1 text-[24px] mb-6 uppercase">
          Frequently Asked Questions
        </Text>

        {FAQ_ITEMS.map((item, i) => (
          <Card key={i} className="mb-3 overflow-hidden p-0">
            <TouchableOpacity
              className="flex-row justify-between items-center p-5"
              onPress={() => setExpanded(expanded === i ? null : i)}
              activeOpacity={0.7}
            >
              <Text className={`text-body text-[15px] flex-1 mr-4 uppercase tracking-tighter ${expanded === i ? 'text-primary font-jakarta-bold' : 'text-ink font-jakarta-semibold'}`}>
                {item.q}
              </Text>
              <Ionicons
                name={expanded === i ? "chevron-up" : "chevron-down"}
                size={20}
                color={expanded === i ? "#078365" : "#94A3B8"}
              />
            </TouchableOpacity>
            {expanded === i && (
              <View className="px-5 pb-5 border-t border-gray-50 pt-4">
                <Text className="text-body text-muted leading-[22px] normal-case">
                  {item.a}
                </Text>
              </View>
            )}
          </Card>
        ))}

        <Text className="text-h1 text-[24px] mt-12 mb-6 uppercase">Contact Support</Text>
        <AppTextInput
          placeholder="DESCRIBE YOUR ISSUE..."
          value={contactMsg}
          onChangeText={setContactMsg}
          multiline
          numberOfLines={4}
          className="min-h-[140px] p-5 shadow-sm"
          style={{ textAlignVertical: "top" }}
        />
        <PrimaryButton
          title="SEND MESSAGE"
          onPress={() => {
            setContactMsg("");
          }}
          disabled={!contactMsg.trim()}
          className="mt-6 h-15 rounded-md"
        />

        <View className="mt-12 gap-5 px-1">
          <View className="flex-row items-center gap-4 bg-surface p-4 rounded-xl border border-card-border shadow-xs">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              <Ionicons name="mail-outline" size={18} color="#078365" />
            </View>
            <Text className="text-body text-ink font-jakarta-bold">support@loom.ng</Text>
          </View>
          <View className="flex-row items-center gap-4 bg-surface p-4 rounded-xl border border-card-border shadow-xs">
            <View className="w-10 h-10 rounded-full bg-info/10 items-center justify-center">
              <Ionicons name="call-outline" size={18} color="#3B82F6" />
            </View>
            <Text className="text-body text-ink font-jakarta-bold">+234 901 234 5678</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

