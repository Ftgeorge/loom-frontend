import BackButton from "@/components/ui/BackButton";
import { OauthButton, PrimaryButton } from "@/components/ui/Buttons";
import { AppTextInput, PasswordInput } from "@/components/ui/TextInputs";
import { useAppStore } from "@/store";
import { SignInSchema, mapZodErrors } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, user } = useAppStore();
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
    await new Promise((r) => setTimeout(r, 1000));
    signIn(user?.role ?? "client");
    setLoading(false);
    router.replace(
      user?.role === "artisan" ? "/(tabs)/dashboard" : "/(tabs)/home",
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 32, paddingTop: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={() => router.back()} />
        <View className="mb-10">
          <Text className="text-3xl font-extrabold text-graphite tracking-tight">Welcome Back</Text>
          <Text className="text-base text-muted leading-relaxed mt-2">
            Sign in to continue using Loom
          </Text>
        </View>

        <AppTextInput
          label="Phone Number or Email"
          placeholder="+234 801 234 5678"
          value={form.phone}
          onChangeText={(phone) => setForm({ ...form, phone })}
          error={errors.phone}
          keyboardType="phone-pad"
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={form.password}
          onChangeText={(password) => setForm({ ...form, password })}
          error={errors.password}
        />

        <TouchableOpacity
          className="self-end p-2"
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          <Text className="text-sm text-graphite font-bold">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Sign In"
          onPress={handleSignIn}
          loading={loading}
          style={{ marginTop: 16 }}
          className="bg-graphite"
        />

        <View className="flex flex-row items-center gap-4 px-2 my-6">
          <View className="flex-1 h-[1px] bg-gray-50" />
          <Text className="text-xs text-muted font-semibold tracking-widest uppercase">Or</Text>
          <View className="flex-1 h-[1px] bg-gray-50" />
        </View>

        <OauthButton
          title="Continue with Google"
          onPress={() => { }}
          className="border-gray-100"
          textStyle={{ color: '#2C2C2C' }} // Hardcoded graphite color for compatibility with existing OauthButton interface
          image={require("../../assets/images/google-icon.jpeg")}
        />

        <View
          className="flex flex-row items-center justify-center mt-12 gap-2"
        >
          <Text className="text-base text-muted">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
            <Text className="text-graphite font-bold text-base">Sign Up</Text>
          </TouchableOpacity>
        </View>


      </ScrollView>
    </KeyboardAvoidingView>
  );
}
