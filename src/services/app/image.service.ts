import { CapacitorHttp } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import mime from "mime";

class ImageService {
  private CACHE_PATH = Directory.Cache;

  async fetchImage(src: string) {
    const cachedImage = await this.fetchImageFromCache(src);

    if (cachedImage) {
      return cachedImage;
    }

    const networkImage = await this.fetchImageFromNetwork(src);

    return networkImage;
  }

  private async fetchImageFromNetwork(src: string) {
    const { data } = await CapacitorHttp.get({
      url: src,
      responseType: "blob",
    });

    await this.cacheNetworkImage(src, data);

    return src;
  }

  private async cacheNetworkImage(src: string, data: string | Blob) {
    const path = this.getPath(src);

    try {
      return await Filesystem.writeFile({
        path,
        data,
      });
    } catch (error) {
      return false;
    }
  }

  private async fetchImageFromCache(src: string) {
    const path = this.getPath(src);

    try {
      const fileExists = await Filesystem.stat({
        path,
      });
      if (fileExists) {
        const { data } = await Filesystem.readFile({
          path,
        });
        return this.base64ToBlob(src, data as string);
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  private getFileName(src: string): string {
    const url = new URL(src);

    return url.pathname.substring(url.pathname.lastIndexOf("/") + 1);
  }
  private getPath(src: string): string {
    const fileName = this.getFileName(src);

    return `${this.CACHE_PATH}/${fileName}`;
  }

  private getMime(src: string): string {
    const fileName = this.getFileName(src);

    return fileName.split(".")[1];
  }

  private blobToBase64(blob: Blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  private base64ToBlob(src: string, data: string) {
    const mimeType = this.getMime(src);

    return `data:${mime.getType(mimeType)};base64,${data}`;
  }
}
export const imageService = new ImageService();
