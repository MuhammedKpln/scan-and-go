import { IonText } from "@ionic/react";
import styles from "./DividerWithText.module.scss";

type IProps = {
  text: string;
};

export default function DividerWithText(props: IProps) {
  return (
    <div className={styles.divider}>
      <IonText color="medium">{props.text}</IonText>
    </div>
  );
}
