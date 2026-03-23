import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, Settings, ChevronRight, LogOut } from "lucide-react-native";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const MenuLink = ({ icon: Icon, label }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#F9FAFB",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} color="#6B7280" />
      </View>
      <Text
        style={{
          flex: 1,
          marginLeft: 12,
          fontSize: 16,
          color: "#111827",
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
      <ChevronRight size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <View
        style={{
          padding: 20,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#FEF2F2",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <User size={48} color="#FF6B6B" />
        </View>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>
          Happy Cook
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280" }}>
          cooking@example.com
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <MenuLink icon={Settings} label="Cooking Preferences" />
        <MenuLink icon={Settings} label="Notifications" />
        <MenuLink icon={LogOut} label="Log Out" />
      </View>
    </View>
  );
}
