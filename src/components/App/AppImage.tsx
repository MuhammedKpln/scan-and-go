import { imageService } from "@/services/app/image.service";
import { IonImg } from "@ionic/react";
import { useEffect, useState } from "react";

type IProps = {
  cacheNetworkImage?: boolean;
} & React.ComponentProps<typeof IonImg>;

export default function AppImage({
  src,
  cacheNetworkImage = true,
  ...rest
}: IProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  useEffect(() => {
    async function fetchImage() {
      if (src?.startsWith("/src/assets/")) {
        setImageSrc(src);

        return;
      }

      if (src) {
        const source = await imageService.fetchImage(src);

        setImageSrc(source);
      }
    }

    if (cacheNetworkImage) {
      fetchImage();
    }
  }, []);

  if (!cacheNetworkImage) return <IonImg src={src} {...rest} />;
  if (imageSrc) return <IonImg src={imageSrc} {...rest} />;
}
