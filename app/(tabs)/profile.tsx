import { SubAppHeader } from "@/components/AppSubHeader";
import { Avatar } from "@/components/ui/AvatarRating";
import { LoomThread } from "@/components/ui/LoomThread";
import { languageNames } from "@/i18n";
import { useAppStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, language, signOut, savedArtisans } = useAppStore();
  const isArtisan = user?.role === "artisan";

  const [artisanId, setArtisanId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isArtisan) {
      import('@/services/api').then(({ artisanApi }) => {
        artisanApi.meProfile().then((res: any) => {
          if (res?.artisan_profile_id) setArtisanId(res.artisan_profile_id);
        }).catch(() => { });
      });
    }
  }, [isArtisan]);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut();
          router.replace("/");
        },
      },
    ]);
  };

  interface MenuItem {
    icon: string;
    label: string;
    onPress: () => void;
    danger?: boolean;
  }

  interface MenuSection {
    title: string;
    items: MenuItem[];
  }

  const menuSections: MenuSection[] = [
    {
      title: "ACTIVITY",
      items: isArtisan
        ? [
          {
            icon: "person-outline",
            label: "View Public Profile",
            onPress: () => artisanId && router.push({ pathname: '/artisan-profile', params: { id: artisanId } }),
          },
          {
            icon: "shield-checkmark-outline",
            label: "Verification Status",
            onPress: () => router.push("/verification"),
          },
          {
            icon: "construct-outline",
            label: "Professional Skills",
            onPress: () => router.push("/manage-skills"),
          },
        ]
        : [
          {
            icon: "bookmark-outline",
            label: `Saved Professionals (${savedArtisans.length})`,
            onPress: () => { },
          },
          { icon: "receipt-outline", label: "Payment History", onPress: () => { } },
          {
            icon: "hammer-outline",
            label: "Switch to Artisan Account",
            onPress: () => {
              Alert.alert(
                "Become an Artisan",
                "Do you want to start offering your services on Loom?",
                [
                  { text: "Later", style: "cancel" },
                  {
                    text: "Let's Go",
                    onPress: () => {
                      import('@/store').then(({ useAppStore }) => {
                        useAppStore.getState().switchRole('artisan');
                        router.push('/artisan-onboarding');
                      });
                    }
                  }
                ]
              );
            },
          },
        ],
    },
    {
      title: "PREFERENCES",
      items: [
        {
          icon: "settings-outline",
          label: "General Settings",
          onPress: () => router.push("/settings"),
        },
        {
          icon: "language-outline",
          label: `Language: ${languageNames[language]}`,
          onPress: () => router.push("/settings"),
        },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        {
          icon: "help-circle-outline",
          label: "Help & Support Center",
          onPress: () => router.push("/help"),
        },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        {
          icon: "log-out-outline",
          label: "Sign Out",
          onPress: handleLogout,
          danger: true,
        },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <LoomThread variant="minimal" opacity={0.2} animated />
      <SubAppHeader
        label="IDENTITY"
        title="My Profile"
        description="Manage your personal information and preferences."
        onNotification={() => router.push('/notifications')}
      />

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Command Center */}
        <Animated.View entering={FadeInDown.springify()} className="items-center py-10">
          {/* ─── Premium Avatar Complex ────────────────────────────────────────── */}
          <View className="mb-6 relative">
            <View className="p-3 rounded-full bg-white border border-card-border shadow-md">
              <View className="p-[6px] rounded-full border-2 border-primary/10 border-dashed">
                <View className="rounded-full overflow-hidden shadow-sm">
                  <Avatar name={user?.name || "U"} size={110} />
                </View>
              </View>

              {/* Floating Camera Action */}
              <TouchableOpacity
                activeOpacity={0.9}
                className="absolute bottom-3 right-3 bg-ink w-[38px] h-[38px] rounded-full border-4 border-white items-center justify-center shadow-md"
              >
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>

            {/* Identity Halo (Subtle Glow) */}
            <View className="absolute -top-5 -left-5 -right-5 -bottom-5 rounded-full bg-primary opacity-[0.03] -z-10" />
          </View>

          {/* ─── Profile Details ──────────────────────────────────────────────── */}

          <Text className="text-h1 mt-2 text-[32px] text-ink font-jakarta-extrabold text-center">
            {user?.name?.toUpperCase()}
          </Text>

          <View className="flex-row items-center gap-3 mt-4">
            <View className="bg-primary px-3 py-[6px] rounded-full border border-primary">
              <Text className="text-label text-white text-[10px] font-jakarta-bold tracking-[0.5px]">
                {isArtisan ? "VERIFIED" : "CLIENT"}
              </Text>
            </View>

            <View className="flex-row items-center gap-[6px]">
              <Ionicons name="location" size={14} className="text-muted" />
              <Text className="text-body-sm text-muted font-jakarta-semibold">
                {user?.location?.city?.toUpperCase() || "LOCATION NOT SET"}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View className="gap-8">
          {menuSections.map((section, sectionIdx) => (
            <View key={section.title}>
              <Text className="text-label text-muted text-[10px] tracking-[1.5px] mb-4 px-1">
                {section.title}
              </Text>

              <View className="gap-[10px]">
                {section.items.map((item, i) => (
                  <Animated.View
                    key={item.label}
                    entering={FadeInDown.delay(200 + (sectionIdx * 100) + (i * 50)).springify()}
                  >
                    <TouchableOpacity
                      className="flex-row items-center p-4 bg-white rounded-sm gap-4 border border-card-border shadow-sm"
                      onPress={item.onPress}
                      activeOpacity={0.7}
                    >
                      <View className={`w-10 h-10 rounded-xs items-center justify-center border ${
                        item.danger ? 'bg-error/10 border-error/25' : 'bg-surface border-card-border'
                      }`}>
                        <Ionicons
                          name={item.icon as any}
                          size={20}
                          className={item.danger ? 'text-error' : 'text-primary'}
                        />
                      </View>

                      <Text
                        className={`flex-1 font-jakarta-semibold text-[15px] ${
                            item.danger ? 'text-error' : 'text-ink'
                        }`}
                      >
                        {item.label}
                      </Text>

                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        className="text-gray-400"
                      />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View className="mt-16 items-center">
          <View className="h-[1px] w-10 bg-card-border mb-4" />
          <Text className="text-label text-center opacity-30 text-[8px] tracking-[4px]">
            LOOM v4.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

