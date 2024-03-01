import NO_AVATAR from "@/assets/noavatar.svg";
import { imageService } from "@/services/app/image.service";
import { IonImg, IonSpinner } from "@ionic/react";
import { useEffect, useState } from "react";
type IProps = React.ComponentProps<typeof IonImg>;
export default function AppImage({ src, ...rest }: IProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  useEffect(() => {
    async function fetchImage() {
      if (src === NO_AVATAR) {
        setImageSrc(NO_AVATAR);

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
