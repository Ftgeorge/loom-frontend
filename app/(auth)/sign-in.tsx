import BackButton from "@/components/ui/BackButton";
import { PrimaryButton } from "@/components/ui/Buttons";
import { LoomThread } from "@/components/ui/LoomThread";
import { AppTextInput, PasswordInput } from "@/components/ui/TextInputs";
import { authApi } from "@/services/api";
import { mapUser } from "@/services/mappers";
import { useAppStore } from "@/store";
import { Colors, Radius, Shadows, Typography } from "@/theme";
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
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LoomThread variant="minimal" scale={1.2} animated opacity={0.3} />

      <ScrollView
        contentContainerStyle={{ padding: 32, paddingTop: 80 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={() => router.back()} />

        <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 48, marginTop: 32 }}>
          <Text style={[Typography.label, { color: Colors.primary, marginBottom: 8 }]}>WELCOME BACK</Text>
          <Text style={[Typography.h1, { fontSize: 32 }]}>Sign In to{"\n"}Your Account</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 12, lineHeight: 22 }]}>
            Enter your credentials to continue.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <AppTextInput
            label="Email or Phone"
            placeholder="you@example.com"
            value={form.phone}
            onChangeText={(phone) => setForm({ ...form, phone })}
            error={errors.phone}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={{ borderRadius: Radius.xs }}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            error={errors.password}
            containerStyle={{ borderRadius: Radius.xs }}
          />

          <TouchableOpacity
            style={{ alignSelf: "flex-end", paddingVertical: 12 }}
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text style={[Typography.label, { color: Colors.primary, fontSize: 10, textTransform: 'none' }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            style={{ marginTop: 32, height: 60, borderRadius: Radius.sm }}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 64,
            padding: 20,
            backgroundColor: Colors.white,
            borderRadius: Radius.xs,
            borderWidth: 1,
            borderColor: Colors.cardBorder
          }}>
            <Text style={[Typography.label, { color: Colors.muted, fontSize: 10, textTransform: 'none' }]}>
              Don't have an account?{" "}
              <Text
                onPress={() => router.push("/role-selection")}
                style={{ color: Colors.primary, fontWeight: "800" }}
              >
                Create Account
              </Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
