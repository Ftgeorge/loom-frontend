import { SubAppHeader } from "@/components/AppSubHeader";
import { Avatar } from "@/components/ui/AvatarRating";
import { Card } from "@/components/ui/CardChipBadge";
import { LoomThread } from "@/components/ui/LoomThread";
import { languageNames, t } from "@/i18n";
import { useAppStore } from "@/store";
import { Colors, Radius, Shadows, Typography } from "@/theme";
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
          { icon: "star-outline", label: "My Reviews", onPress: () => { } },
          {
            icon: "shield-checkmark-outline",
            label: "Verification Status",
            onPress: () => router.push("/verification"),
          },
          {
            icon: "construct-outline",
            label: "Manage Skills",
            onPress: () => router.push("/artisan-onboarding"),
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
                "Become a Professional",
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
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
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
        <Animated.View entering={FadeInDown.springify()} style={{ alignItems: "center", paddingVertical: 40 }}>
          {/* ─── Premium Avatar Complex ────────────────────────────────────────── */}
          <View style={{ marginBottom: 24 }}>
            <View style={{
              padding: 12,
              borderRadius: 80,
              backgroundColor: Colors.white,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              ...Shadows.md
            }}>
              <View style={{
                padding: 6,
                borderRadius: 70,
                borderWidth: 2,
                borderColor: Colors.primary + '10',
                borderStyle: 'dashed'
              }}>
                <View style={{
                  borderRadius: 60,
                  overflow: 'hidden',
                  ...Shadows.sm
                }}>
                  <Avatar name={user?.name || "U"} size={110} />
                </View>
              </View>

              {/* Floating Camera Action */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  backgroundColor: Colors.ink,
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  borderWidth: 4,
                  borderColor: Colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...Shadows.md
                }}
              >
                <Ionicons name="camera" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {/* Identity Halo (Subtle Glow) */}
            <View style={{
              position: 'absolute',
              top: -20,
              left: -20,
              right: -20,
              bottom: -20,
              borderRadius: 100,
              backgroundColor: Colors.primary,
              opacity: 0.03,
              zIndex: -1
            }} />
          </View>

          {/* ─── Profile Details ──────────────────────────────────────────────── */}
          <Text style={[Typography.label, {
            color: Colors.primary,
            fontSize: 10,
            letterSpacing: 3,
            fontWeight: '800',
            opacity: 0.6
          }]}>
            IDENTITY KEY
          </Text>

          <Text style={[Typography.h1, {
            marginTop: 8,
            fontSize: 32,
            color: Colors.ink,
            fontFamily: 'PlusJakartaSans-ExtraBold'
          }]}>
            {user?.name?.toUpperCase()}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <View style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: Radius.full,
              borderWidth: 1,
              borderColor: Colors.primary
            }}>
              <Text style={[Typography.label, {
                color: Colors.white,
                fontSize: 10,
                fontWeight: '700',
                letterSpacing: 0.5
              }]}>
                {isArtisan ? "VERIFIED PRO" : "CLIENT"}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="location" size={14} color={Colors.muted} />
              <Text style={[Typography.bodySmall, { color: Colors.muted, fontWeight: '600' }]}>
                {user?.location?.city?.toUpperCase() || "LOCATION NOT SET"}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={{ gap: 32 }}>
          {menuSections.map((section, sectionIdx) => (
            <View key={section.title}>
              <Text style={[Typography.label, {
                color: Colors.muted,
                fontSize: 10,
                letterSpacing: 1.5,
                marginBottom: 16,
                paddingHorizontal: 4
              }]}>
                {section.title}
              </Text>

              <View style={{ gap: 10 }}>
                {section.items.map((item, i) => (
                  <Animated.View
                    key={item.label}
                    entering={FadeInDown.delay(200 + (sectionIdx * 100) + (i * 50)).springify()}
                  >
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        backgroundColor: Colors.white,
                        borderRadius: Radius.lg,
                        gap: 16,
                        borderWidth: 1,
                        borderColor: Colors.cardBorder,
                        ...Shadows.sm
                      }}
                      onPress={item.onPress}
                      activeOpacity={0.7}
                    >
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: Radius.sm,
                        backgroundColor: item.danger ? Colors.error + '10' : Colors.surface,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: item.danger ? Colors.error + '25' : Colors.cardBorder
                      }}>
                        <Ionicons
                          name={item.icon as any}
                          size={20}
                          color={item.danger ? Colors.error : Colors.primary}
                        />
                      </View>

                      <Text
                        style={[
                          Typography.body,
                          {
                            flex: 1,
                            fontWeight: '600',
                            color: item.danger ? Colors.error : Colors.ink,
                            fontSize: 15
                          }
                        ]}
                      >
                        {item.label}
                      </Text>

                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={Colors.gray400}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 64, alignItems: 'center' }}>
          <View style={{ height: 1, width: 40, backgroundColor: Colors.cardBorder, marginBottom: 16 }} />
          <Text style={[Typography.label, { textAlign: 'center', opacity: 0.3, fontSize: 8, letterSpacing: 4 }]}>
            LOOM v4.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
