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
    Alert.alert("Sign Out", "Are you sure you want to sign out of your operative terminal?", [
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
    badge?: string;
  }

  interface MenuSection {
    title: string;
    items: MenuItem[];
  }

  const menuSections: MenuSection[] = [
    {
      title: "OPERATIONAL ACTIVITY",
      items: isArtisan
        ? [
          {
            icon: "person",
            label: "VIEW PUBLIC PROFILE",
            onPress: () => artisanId && router.push({ pathname: '/artisan-profile', params: { id: artisanId } }),
          },
          {
            icon: "shield-checkmark",
            label: "VERIFICATION STATUS",
            onPress: () => router.push("/verification"),
          },
          {
            icon: "construct",
            label: "PROFESSIONAL SKILLS",
            onPress: () => router.push("/manage-skills"),
          },
        ]
        : [
          {
            icon: "bookmark",
            label: "SAVED PROFESSIONALS",
            badge: `${savedArtisans.length}`,
            onPress: () => { },
          },
          { icon: "receipt", label: "PAYMENT HISTORY", onPress: () => { } },
          {
            icon: "swap-horizontal",
            label: "SWITCH TO ARTISAN MODE",
            onPress: () => {
              Alert.alert(
                "Initialize Artisan Protocol",
                "Start deploying your professional services on the Loom ecosystem?",
                [
                  { text: "Later", style: "cancel" },
                  {
                    text: "Initialize",
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
      title: "SYSTEM PREFERENCES",
      items: [
        {
          icon: "settings-sharp",
          label: "GENERAL CONFIGURATION",
          onPress: () => router.push("/settings"),
        },
        {
          icon: "language",
          label: `LANGUAGE: ${languageNames[language].toUpperCase()}`,
          onPress: () => router.push("/settings"),
        },
      ],
    },
    {
      title: "INTELLIGENCE SUPPORT",
      items: [
        {
          icon: "help-buoy",
          label: "SUPPORT CENTER",
          onPress: () => router.push("/help"),
        },
      ],
    },
    {
      title: "TERMINAL ACCESS",
      items: [
        {
          icon: "power",
          label: "SIGN OUT",
          onPress: handleLogout,
          danger: true,
        },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <View className="absolute inset-0">
        <LoomThread variant="minimal" opacity={0.2} animated />
      </View>
      <SubAppHeader
        label="IDENTITY PORTAL"
        title="MY PROFILE"
        description="Manage your operative profile and system preferences."
        onNotification={() => router.push('/notifications')}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 28, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Profile Command Center ────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.springify()} className="items-center py-12">
          <View className="mb-8 relative">
            {/* Identity Halo */}
            <View className="absolute -top-6 -left-6 -right-6 -bottom-6 rounded-full bg-primary/5 -z-10" />
            <View className="absolute -top-12 -left-12 -right-12 -bottom-12 rounded-full bg-primary/[0.02] -z-20" />
            
            <View className="p-4 rounded-full bg-white border border-card-border shadow-2xl">
              <View className="p-1.5 rounded-full border-[1.5px] border-primary/20 border-dashed">
                <View className="rounded-full overflow-hidden shadow-sm border border-card-border">
                  <Avatar name={user?.name || "U"} size={110} />
                </View>
              </View>

              {/* Tactical Camera Action */}
              <TouchableOpacity
                activeOpacity={0.9}
                className="absolute bottom-4 right-4 bg-ink w-11 h-11 rounded-full border-4 border-white items-center justify-center shadow-2xl"
              >
                <Ionicons name="camera-reverse" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── Profile Identification ──────────────────────────────────────────────── */}
          <Text className="text-h1 mt-3 text-[38px] leading-[40px] text-ink font-jakarta-extrabold italic tracking-tighter text-center uppercase">
            {user?.name || "Trial Operative"}
          </Text>

          <View className="flex-row items-center gap-4 mt-6">
            <View className={`px-4 py-2 rounded-xl border items-center shadow-sm ${
              isArtisan ? 'bg-primary/10 border-primary' : 'bg-accent/10 border-accent'
            }`}>
              <Text className={`text-label text-[10px] font-jakarta-extrabold italic tracking-[1.5px] uppercase ${
                isArtisan ? 'text-primary' : 'text-accent'
              }`}>
                {isArtisan ? "VERIFIED PRO" : "ACTIVE CLIENT"}
              </Text>
            </View>

            <View className="flex-row items-center gap-2 px-3 py-2 bg-background rounded-xl border border-card-border">
              <Ionicons name="location-sharp" size={14} color="#64748B" />
              <Text className="text-body-sm text-ink/60 font-jakarta-extrabold italic uppercase text-[10px] tracking-tight">
                {user?.location?.city?.toUpperCase() || "LOCALIZING..."}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View className="gap-10">
          {menuSections.map((section, sectionIdx) => (
            <View key={section.title}>
              <View className="flex-row items-center gap-2 mb-5 px-1">
                <View className="w-1 h-1 rounded-full bg-primary" />
                <Text className="text-label text-primary text-[10px] tracking-[2.5px] font-jakarta-extrabold italic uppercase">
                  {section.title}
                </Text>
              </View>

              <View className="gap-3">
                {section.items.map((item, i) => (
                  <Animated.View
                    key={item.label}
                    entering={FadeInDown.delay(200 + (sectionIdx * 100) + (i * 50)).springify()}
                  >
                    <TouchableOpacity
                      className="flex-row items-center p-5 bg-white rounded-2xl gap-5 border-[1.5px] border-card-border shadow-sm active:bg-gray-50"
                      onPress={item.onPress}
                      activeOpacity={0.7}
                    >
                      <View className={`w-12 h-12 rounded-xl items-center justify-center border shadow-sm ${
                        item.danger ? 'bg-destructive/10 border-destructive/20' : 'bg-background border-card-border'
                      }`}>
                        <Ionicons
                          name={item.icon as any}
                          size={22}
                          color={item.danger ? '#EF4444' : '#00120C'}
                        />
                      </View>

                      <View className="flex-1">
                        <Text
                          className={`font-jakarta-extrabold italic text-[14px] uppercase tracking-tighter ${
                              item.danger ? 'text-destructive' : 'text-ink'
                          }`}
                        >
                          {item.label}
                        </Text>
                        {item.badge && (
                          <Text className="text-[10px] text-muted font-jakarta-bold uppercase italic tracking-widest mt-0.5">
                            {item.badge} ITEMS DETECTED
                          </Text>
                        )}
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#CBD5E1"
                      />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View className="mt-20 items-center">
            <View className="flex-row items-center gap-2 opacity-20">
                <Ionicons name="id-card-outline" size={14} color="#64748B" />
                <Text className="text-[9px] text-muted uppercase tracking-[4px] font-jakarta-bold italic">LOOM TERMINAL v4.2.0 • STABLE</Text>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}


