import NO_AVATAR_IMAGE from "@/assets/noavatar.svg";
import { IonAvatar, IonImg } from "@ionic/react";

interface IProps extends React.ComponentProps<typeof IonAvatar> {
  url?: string | null;
}
export default function AppAvatar({ url, ...rest }: IProps) {
  return (
    <IonAvatar {...rest}>
      {rest.children ? rest.children : <IonImg src={url ?? NO_AVATAR_IMAGE} />}
    </IonAvatar>
  );
}
