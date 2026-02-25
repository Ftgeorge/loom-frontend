import { Colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

export default function BackButton({ onPress }: { onPress: () => void }) {
    return (
        <View className="flex-row items-center mb-6">
            <TouchableOpacity
            onPress={onPress}
            className="p-2 rounded-full bg-gray-100 items-center justify-center max-w-fit "
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Go back"
        >
            <Ionicons name="chevron-back" size={20} color={Colors.gray500} />
        </TouchableOpacity>
        </View>
    );
}