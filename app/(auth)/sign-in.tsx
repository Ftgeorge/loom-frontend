import BackButton from "@/components/ui/BackButton";
import { PrimaryButton } from "@/components/ui/Buttons";
import { LoomThread } from "@/components/ui/LoomThread";
import { AppTextInput, PasswordInput } from "@/components/ui/TextInputs";
import { authApi } from "@/services/api";
import { useAppStore } from "@/store";
import { Colors, Typography } from "@/theme";
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
        email: form.phone, // field accepts email or phone
        password: form.password,
      });

      signIn(
        (res.user.role as any) ?? "client",
        {
          id: res.user.id,
          email: res.user.email,
          name: res.user.name ?? form.phone,
        },
        res.token
      );

      router.replace(
        res.user.role === "artisan" ? "/(tabs)/dashboard" : "/(tabs)/home"
      );
    } catch (err: any) {
      Alert.alert("Sign In Failed", err.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0, opacity: 0.4 }}>
        <LoomThread variant="complex" scale={1.2} animated />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 32, paddingTop: 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={() => router.back()} />

        <Animated.View entering={FadeInDown.delay(100)} style={{ marginBottom: 40, marginTop: 24 }}>
          <Text style={Typography.h1}>Welcome Back</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8 }]}>
            Sign in to continue using Loom.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <AppTextInput
            label="Email"
            placeholder="you@email.com"
            value={form.phone}
            onChangeText={(phone) => setForm({ ...form, phone })}
            error={errors.phone}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            error={errors.password}
          />

          <TouchableOpacity
            style={{ alignSelf: "flex-end", paddingVertical: 8 }}
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text style={[Typography.bodySmall, { color: Colors.primary, fontWeight: "600", textDecorationLine: "underline" }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            style={{ marginTop: 24 }}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 48, gap: 6 }}>
            <Text style={[Typography.body, { color: Colors.textSecondary }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text style={[Typography.body, { color: Colors.primary, fontWeight: "700" }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
