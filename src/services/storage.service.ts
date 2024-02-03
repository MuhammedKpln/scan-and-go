import { StorageFolders } from "@/models/storage.model";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
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

  getAvatar(path: string) {
    const storageRef = ref(this.storage, path);

    return getDownloadURL(storageRef);
  }
}

export const storageService = new StorageService();
