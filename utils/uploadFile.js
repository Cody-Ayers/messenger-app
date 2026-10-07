import { File } from "expo-file-system";

// Uploads images and audio to Cloudinary using an unsigned upload preset.
// Both values are safe to ship in the app: an unsigned preset has no secret,
// and the preset itself limits the folder, file types and size.
const CLOUDINARY_CLOUD_NAME = "ussvv1ej";
const CLOUDINARY_UPLOAD_PRESET = "cqvtpmxq";

// Upload a local file and return its public https URL
export const uploadFile = async (fileURI) => {
  const file = new File(fileURI);

  // Expo's fetch needs a real Blob in FormData; an Expo File is one
  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  // "auto" lets Cloudinary detect whether the file is an image or audio
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    { method: "POST", body: formData }
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Upload failed");
  }
  return result.secure_url;
};
