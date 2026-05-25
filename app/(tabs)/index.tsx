import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddTripForm from "@/components/AddTripForm";
import ScreenHeader from "@/components/ScreenHeader";
import TripCard from "@/components/TripCard";
import EmptyState from "@/components/ui/EmptyState";
import { Colors } from "@/constants/Colors";
import type { Trip, TripData } from "@/types/trip";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleAddTrip = (data: TripData): void => {
    const newTrip: Trip = { id: Date.now().toString(), ...data };
    setTrips([newTrip, ...trips]);
  };

  const handleDeleteTrip = (id: string): void => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader tripCount={trips.length} />
      <ScrollView
        contentContainerStyle={styles.content}
        style={styles.container}
      >
        {/* <TripStats trips={trips} /> */}
        <AddTripForm onAdd={handleAddTrip} />

        {trips.length === 0 ? (
          <EmptyState
            icon="airplane-outline"
            title="Brak podróży"
            subtitle="Dodaj swoją pierwszą podróż!"
          />
        ) : (
          trips.map((trip) => (
            <Link
              key={trip.id}
              href={{
                pathname: "/trip/[id]",
                params: {
                  id: trip.id,
                  title: trip.title,
                  destination: trip.destination,
                  date: trip.date,
                  rating: trip.rating,
                },
              }}
              asChild
            >
              <Pressable>
                <TripCard
                  key={trip.id}
                  title={trip.title}
                  destination={trip.destination}
                  date={trip.date}
                  rating={trip.rating}
                  onDelete={() => handleDeleteTrip(trip.id)}
                />
              </Pressable>
            </Link>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
});
