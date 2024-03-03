import DATA_EMPTY from "@/assets/empty.svg";
import AppImage from "../App/AppImage";
import AppButton from "../AppButton";
import styles from "./DataEmpty.module.scss";

type IProps = {
  message?: string;
  btn?: {
    label: string;
    handler: () => void;
  };
};

export default function DataEmpty({ message, btn }: IProps) {
  return (
    <div className={styles.container}>
      <AppImage src={DATA_EMPTY} className="w-6/12" />

      <h1>Woah! so empty!</h1>
      <p>{message ?? "Why not adding some goodies?"}</p>

      {btn && <AppButton onClick={btn.handler}>{btn.label}</AppButton>}
    </div>
  );
}
