import BackButton from "@/components/ui/BackButton";
import { PrimaryButton } from "@/components/ui/Buttons";
import { LoomThread } from "@/components/ui/LoomThread";
import { AppTextInput, PasswordInput } from "@/components/ui/TextInputs";
import { authApi } from "@/services/api";
import { mapUser } from "@/services/mappers";
import { useAppStore } from "@/store";
import { SignInSchema, mapZodErrors } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAppStore();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const result = SignInSchema.safeParse(form);
    if (!result.success) {
      setErrors(mapZodErrors(result.error));
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await authApi.login({
        email: form.phone,
        password: form.password,
      });

      const mappedUser = mapUser(res.user);
      signIn(
        mappedUser.role as any,
        mappedUser,
        res.token
      );

      router.replace(
        mappedUser.role === "artisan" ? "/(tabs)/dashboard" : "/(tabs)/home"
      );
    } catch (err: any) {
      Alert.alert("Authentication Failed", err.message ?? "Credentials could not be verified.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="absolute inset-0">
        <LoomThread variant="minimal" scale={1.2} animated opacity={0.3} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 32, paddingTop: 80 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={() => router.back()} />

        <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-14 mt-10 px-1">
          <Text className="text-label text-primary mb-3 tracking-[2px] uppercase font-jakarta-extrabold italic">WELCOME BACK</Text>
          <Text className="text-h1 text-[42px] leading-[44px] uppercase italic font-jakarta-extrabold tracking-tighter">
            SIGN IN TO{"\n"}YOUR ACCOUNT
          </Text>
          <Text className="text-body text-ink/70 mt-5 leading-[24px] font-jakarta-medium max-w-[280px]">
            Initialize your credentials to access the operative ecosystem.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View className="gap-5">
            <AppTextInput
              label="PROTOCOL (EMAIL OR PHONE)"
              placeholder="id@loom.network"
              value={form.phone}
              onChangeText={(phone) => setForm({ ...form, phone })}
              error={errors.phone}
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-16 rounded-[20px]"
            />
            <PasswordInput
              label="SECURITY KEY"
              placeholder="••••••••••••"
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
              error={errors.password}
              className="h-16 rounded-[20px]"
            />
          </View>

          <TouchableOpacity
            className="self-end py-4 px-2"
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text className="text-label text-primary text-[10px] uppercase font-jakarta-bold italic tracking-widest">
              Emergency Key Recovery?
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title="AUTHENTICATE"
            onPress={handleSignIn}
            loading={loading}
            className="mt-8 h-16 rounded-xl shadow-2xl border border-primary/20"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <View className="mt-16 p-6 bg-white rounded-[28px] border-[1.5px] border-card-border shadow-md flex-row items-center justify-center gap-3">
            <Ionicons name="person-add-outline" size={18} color="#64748B" />
            <Text className="text-label text-muted text-[11px] uppercase font-jakarta-bold tracking-tight">
              New to the ecosystem?{" "}
              <Text
                onPress={() => router.push("/role-selection")}
                className="text-primary font-jakarta-extrabold italic"
              >
                CREATE IDENTITY
              </Text>
            </Text>
          </View>
          
          <View className="mt-12 items-center flex-row justify-center gap-2 opacity-30">
            <Ionicons name="shield-checkmark" size={12} color="#64748B" />
            <Text className="text-[8px] text-muted uppercase tracking-[2px] font-jakarta-bold">Encryption Active • Stable v1.0</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

