import { StorageFolders } from "@/models/storage.model";
import { ref, uploadString } from "firebase/storage";
import { storage } from "./firebase.service";

class StorageService {
  private storage = storage;
  uploadAvatar(userUid: string, data_url: string) {
    const storageRef = ref(
      this.storage,
      `${StorageFolders.Avatars}/${userUid}`
    );

    return uploadString(storageRef, data_url, "data_url");
  }
}

export const storageService = new StorageService();
