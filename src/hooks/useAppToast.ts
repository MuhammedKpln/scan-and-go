import { Color } from "@ionic/core";
import { ToastButton, useIonToast } from "@ionic/react";
import { useCallback } from "react";
export enum ToastStatus {
  Success,
  Error,
  Info,
}

interface IProps {
  status: ToastStatus;
  message: string;
  buttons?: ToastButton[];
}
export function useAppToast() {
  const [_showToast, dismissToast] = useIonToast();

  const _toastColor = useCallback((status: ToastStatus): Color => {
    switch (status) {
      case ToastStatus.Success:
        return "success";
      case ToastStatus.Error:
        return "danger";
      case ToastStatus.Info:
        return "secondary";
    }
  }, []);

  const showToast = useCallback(async (props: IProps) => {
    const color = _toastColor(props.status);

    await _showToast({
      message: props.message,
      color,
      buttons: props.buttons,
      duration: 3000,
    });
  }, []);

  return {
    showToast,
    dismissToast,
  };
}
