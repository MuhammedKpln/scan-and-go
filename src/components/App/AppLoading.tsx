import { IonLoading, IonPage } from "@ionic/react";

interface IProps {
  message?: string;
}

export default function AppLoading(props: IProps) {
  return (
    <IonPage>
      <IonLoading isOpen message={props.message ?? "Laddar.."} />
    </IonPage>
  );
}
