import styles from "./tag_card.module.scss";

export default function TagCard() {
  return (
    <div className="">
      <div id="header">
        <div id="status" className={`${styles.cardStatus} active`}>
          {" "}
          Active{" "}
        </div>
      </div>
    </div>
  );
}
