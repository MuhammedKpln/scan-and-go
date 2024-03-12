import { Color } from "@ionic/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { useMemo } from "react";

import { informationCircleOutline } from "ionicons/icons";

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
    <IonItem color={color} className="rounded-md m-2">
      <IonIcon icon={informationCircleOutline} slot="start" color="light" />
      <IonLabel color="light">{props.message}</IonLabel>
    </IonItem>
  );
}
