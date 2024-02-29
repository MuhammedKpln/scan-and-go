import { IonIcon } from "@ionic/react";
import classNames from "classnames";
import { carOutline } from "ionicons/icons";
import styles from "./tag_card.module.scss";

export default function TagCard() {
  return (
    <div className={styles.container}>
      <div id="header" className={styles.header}>
        <div
          id="status"
          className={classNames(styles.cardStatus, styles.deactive)}
        >
          Active
        </div>

        <IonIcon icon={carOutline} size="large" />
      </div>

      <div id="content">
        <div className="text-lg">Nissan Qashqai</div>
        <div className="text-sm">Qashqaim</div>
      </div>

      <div id="footer">23 Februari 2024</div>
    </div>
  );
}
