import { Color } from "@ionic/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { informationCircleOutline } from "ionicons/icons";
import { useMemo } from "react";

export enum InfoCardStatus {
  Information,
  Error,
}

interface IProps {
  message: string;
  status?: InfoCardStatus;
}

export default function AppInfoCard(props: IProps) {
  const color = useMemo<Color>(() => {
    switch (props.status) {
      case InfoCardStatus.Error:
        return "danger";
      case InfoCardStatus.Information:
        return "secondary";
      default:
        return "warning";
    }
  }, [props.status]);

  return (
    <IonItem color={color}>
      <IonIcon icon={informationCircleOutline} slot="start" color="light" />
      <IonLabel color="light">{props.message}</IonLabel>
    </IonItem>
  );
}
