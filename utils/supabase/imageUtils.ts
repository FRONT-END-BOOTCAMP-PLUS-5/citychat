interface ImageRecord {
    storage_path: string;
    public_url?: string;
}

export const CITYCHAT_IMAGE_BUCKET = "citychat-img";

export function getImageUrl(imageData?: ImageRecord | null): string {
  if (!imageData) return "";
  if (imageData.storage_path) return buildImageUrl(imageData.storage_path);

  return "";
}
export function buildImageUrl(storagePath: string, bucketName = CITYCHAT_IMAGE_BUCKET): string {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!SUPABASE_URL) {
    console.error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.");
    return "";
  }

  // 버킷 이름이 경로에 포함되어 있으면 제거
  let relativePath = storagePath;
  if (storagePath.startsWith(bucketName)) {
    relativePath = storagePath.substring(bucketName.length + 1);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${relativePath}`;
}
