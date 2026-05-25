import RatingStars from "@/components/RatingStars";
import { Colors } from "@/constants/Colors";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function TripDetail() {
  const { id, title, destination, date, rating } = useLocalSearchParams<{
    id: string;
    title: string;
    destination: string;
    date: string;
    rating: string;
  }>();

  return (
    <>
      <Stack.Screen options={{ title: title || "Trip" }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text>{title}</Text>
        <Text>{destination}</Text>
        <RatingStars rating={Number(rating)} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
});
