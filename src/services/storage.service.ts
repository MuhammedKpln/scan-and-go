import { Photo } from "@capacitor/camera";
import { decode } from "base64-arraybuffer";
import mime from "mime";
import { BaseService } from "./base.service";

class StorageService extends BaseService {
  async uploadAvatar(userUid: string, photo: Photo) {
    const path = `${userUid}/avatar.${photo.format}`;
    const mimeType = mime.getType(photo.format);

    if (!mimeType) return;

    const { data, error } = await this.client.storage
      .from("avatars")
      .upload(path, decode(photo.base64String!), {
        upsert: true,
        contentType: mimeType,
      });

    if (error) {
      throw error;
    }

    return data;
  }

  getAavatarURL(userUid: string): string {
    const { data } = this.client.storage.from("avatars").getPublicUrl(userUid);

    return data.publicUrl;
  }
}

export const storageService = new StorageService();
