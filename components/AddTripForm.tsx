import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import type { TripData } from "@/types/trip";
import { saveImage } from "@/utils/saveImage";
import * as ImagePicker from "expo-image-picker";

interface AddTripFormProps {
  onAdd: (trip: TripData) => void;
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const validate = (
  title: string,
  destination: string,
  date: string,
  rating: string,
): string | null => {
  if (!title.trim() || !destination.trim() || !date.trim() || !rating.trim())
    return "All fields are required!";
  if (!DATE_REGEX.test(date)) return "Date must be in YYYY-MM-DD format!";
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)
    return "Rating must be a number between 1 and 5!";
  return null;
};

export default function AddTripForm({ onAdd }: AddTripFormProps) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need access to your photo library");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      const savedUri = await saveImage(result.assets[0].uri);
      setImageUri(savedUri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need camera access to take photos");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const savedUri = await saveImage(result.assets[0].uri);
      setImageUri(savedUri);
    }
  };

  const handleAddPhoto = () => {
    Alert.alert("Add photo", "Choose source", [
      { text: "Gallery", onPress: pickImage },
      { text: "Camera", onPress: takePhoto },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSubmit = (): void => {
    const error = validate(title, destination, date, rating);
    if (error) {
      Alert.alert("Error", error);
      return;
    }
    console.log("imageUri:", imageUri);
    onAdd({
      title: title.trim(),
      destination: destination.trim(),
      date: date.trim(),
      rating: Number(rating),
      imageUri: imageUri || undefined,
    });

    setTitle("");
    setDestination("");
    setDate("");
    setRating("");
    setImageUri(undefined);
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Add new trip</Text>
      {imageUri ? (
        <View>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <Pressable onPress={handleAddPhoto}>
            <Text style={styles.changeBtn}>Change photo</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={handleAddPhoto} style={styles.imagePicker}>
          <Text style={styles.pickerText}>📷 Add a photo</Text>
        </Pressable>
      )}

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={Colors.textSecondary}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination"
        placeholderTextColor={Colors.textSecondary}
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor={Colors.textSecondary}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        placeholderTextColor={Colors.textSecondary}
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <Pressable style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Add Trip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  changeBtn: {
    color: Colors.accent,
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
  },
  imagePicker: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  pickerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
