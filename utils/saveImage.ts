import * as FileSystem from "expo-file-system/legacy";
export const saveImage = async (uri: string): Promise<string> => {
  const filename = uri.split("/").pop() || "photo.jpg";
  const dir = (FileSystem.documentDirectory ?? "") + "trips/";
  // Create the folder if it does not exist
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, {
      intermediates: true,
    });
  }
  // Copy from cache to permanent storage
  const dest = dir + filename;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
};
