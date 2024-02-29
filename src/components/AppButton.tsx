import { IonButton, IonSpinner } from "@ionic/react";
import React from "react";

interface IProps extends React.ComponentProps<typeof IonButton> {
  isLoading?: boolean;
}

export default function AppButton({ isLoading, children, ...rest }: IProps) {
  return (
    <IonButton {...rest}>{isLoading ? <IonSpinner /> : children}</IonButton>
  );
}
