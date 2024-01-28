import { Capacitor } from "@capacitor/core";
import { IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { PropsWithChildren, useMemo } from "react";

interface IProps extends PropsWithChildren {
  withBackButton?: boolean;
}

export default function AppHeader({ children, withBackButton }: IProps) {
  const isIos = useMemo(() => Capacitor.getPlatform() === "ios", []);

  return (
    <IonHeader collapse={isIos ? "condense" : undefined}>
      <IonToolbar>
        {withBackButton === true && (
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
        )}

        {children}
      </IonToolbar>
    </IonHeader>
  );
}
