import { imageService } from "@/services/app/image.service";
import { IonImg, IonSpinner } from "@ionic/react";
import { useEffect, useState } from "react";
type IProps = React.ComponentProps<typeof IonImg>;
export default function AppImage({ src, ...rest }: IProps) {
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

    fetchImage();
  }, []);

  if (imageSrc) return <IonImg src={imageSrc} {...rest} />;

  return <IonSpinner />;
}
