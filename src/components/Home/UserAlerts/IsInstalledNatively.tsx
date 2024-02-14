import { useIsNative } from "@/hooks/app/useIsNative";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";

export default function IsInstalledNatively() {
  const { isNative } = useIsNative();

  if (isNative.current) return;

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Download app</IonCardTitle>
        <IonCardSubtitle>For better experience!</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        Download our application for better user experience!
      </IonCardContent>
    </IonCard>
  );
}
