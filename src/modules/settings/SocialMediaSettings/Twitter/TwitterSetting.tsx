import { IonIcon, IonItem, IonLabel, useIonModal } from "@ionic/react";
import { logoTwitter } from "ionicons/icons";
import { lazy, useCallback } from "react";

const modal = lazy(() => import("./TwitterSettingModal"));
export default function TwitterSetting() {
  const onClose = useCallback(() => {
    hideModal(undefined, "cancel");
  }, []);

  const onConfirm = useCallback(() => {
    hideModal(undefined, "confirm");
  }, []);

  const [showModal, hideModal] = useIonModal(modal, {
    onClose,
    onConfirm,
  });

  const onClickItem = useCallback(() => {
    showModal({
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75],
    });
  }, []);

  return (
    <>
      <IonItem button onClick={onClickItem}>
        <IonIcon icon={logoTwitter} slot="start" />
        <IonLabel>Twitter</IonLabel>
      </IonItem>
    </>
  );
}
