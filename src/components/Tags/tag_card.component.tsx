import { Routes } from "@/routes/routes";
import { IonIcon, useIonRouter } from "@ionic/react";
import classNames from "classnames";
import { format } from "date-fns";
import { sv } from "date-fns/locale/sv";
import { motion } from "framer-motion";
import styles from "./tag_card.module.scss";

type IProps = {
  name: string | null;
  note: string | null;
  isActive: boolean;
  icon: string | null;
  created_at: string;
  tagUid: string;
};

export default function TagCard({
  icon,
  isActive,
  name,
  note,
  created_at,
  tagUid,
}: IProps) {
  const history = useIonRouter();

  return (
    <motion.div
      whileTap={{
        scale: 1.05,
      }}
      className={styles.container}
      onClick={() => history.push(Routes.EditTag.replace(":tagUid", tagUid))}
    >
      <div id="header" className={styles.header}>
        <div
          id="status"
          className={classNames(
            styles.cardStatus,
            isActive ? styles.active : styles.deactive
          )}
        >
          {isActive ? "Aktiv" : "Inaktiv"}
        </div>

        {icon && <IonIcon icon={icon} size="large" />}
      </div>

      <div id="content">
        <div className="text-lg">{name}</div>
        <div className="text-sm">{note}</div>
      </div>

      <div id="footer">
        {format(created_at, "d MMMM y", {
          locale: sv,
        })}
      </div>
    </motion.div>
  );
}
