import TripStats from "@/components/TripStats";
import { Colors } from "@/constants/Colors";
import type { Trip } from "@/types/trip";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const trips: Trip[] = [];

const count = trips.length;
const avgRating =
  count > 0
    ? (trips.reduce((sum, t) => sum + t.rating, 0) / count).toFixed(1)
    : "0.0";
const countries = new Set(trips.map((t) => t.destination)).size;

export default function Profile() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={64} color={Colors.primary} />
        <Text style={styles.title}>Your Profile</Text>
      </View>
      <TripStats trips={trips} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
});
