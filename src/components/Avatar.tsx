import NO_AVATAR_IMAGE from "@/assets/noavatar.svg";
import { IonAvatar } from "@ionic/react";
import AppImage from "./App/AppImage";

interface IProps extends React.ComponentProps<typeof IonAvatar> {
  url?: string | null;
  cacheNetworkImage?: boolean;
}
export default function AppAvatar({
  url,
  cacheNetworkImage = true,
  ...rest
}: IProps) {
  return (
    <IonAvatar {...rest}>
      {rest.children ? (
        rest.children
      ) : (
        <AppImage
          cacheNetworkImage={cacheNetworkImage}
          src={url ?? NO_AVATAR_IMAGE}
        />
      )}
    </IonAvatar>
  );
}
