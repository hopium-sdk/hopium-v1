import { put } from "@vercel/blob";

export const uploadImageFromUrl = async ({ url, name }: { url: string; name: string }): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Fetch the image
    const response = await fetch(url);
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch image: ${response.statusText}`,
      };
    }

    const blob = await response.blob();

    // Detect the MIME type (e.g. "image/jpeg", "image/png", etc.)
    const mimeType = blob.type || "application/octet-stream";

    // Try to infer extension from MIME type
    const extension = mimeType.split("/")[1] || "bin";

    // Create a filename based on type
    const fileName = `${name}.${extension}`;

    const file = new File([blob], fileName, { type: mimeType });

    // Upload to Vercel Blob
    const upload = await put(fileName, file, {
      access: "public",
    });

    return {
      success: true,
      url: upload.url,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error during upload",
    };
  }
};
