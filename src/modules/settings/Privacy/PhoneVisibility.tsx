import { useAuthContext } from "@/context/AuthContext";
import { profileService } from "@/services/profile.service";
import { IUserReducerType, useUserStore } from "@/stores/user.store";
import { IonToggleCustomEvent } from "@ionic/core";
import { IonItem, IonToggle, ToggleChangeEventDetail } from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

interface IMutationVariables {
  userUid: string;
  checked: boolean;
}

export default function PhoneVisibility() {
  const { user } = useAuthContext();
  const dispatch = useUserStore((s) => s.dispatch);
  const showPhoneNumber = useUserStore((s) => s.showPhoneNumber);
  const updateShowPhoneNumber = useMutation<void, void, IMutationVariables>({
    mutationFn: async ({ checked, userUid }) => {
      return profileService.updateProfile(userUid, {
        showPhoneNumber: checked,
      });
    },
  });

  const onChange = useCallback(
    async (e: IonToggleCustomEvent<ToggleChangeEventDetail<boolean>>) => {
      dispatch({
        type: IUserReducerType.UpdateUser,
        args: {
          showPhoneNumber: e.target.checked,
        },
      });
      await updateShowPhoneNumber.mutateAsync({
        checked: e.target.checked,
        userUid: user!.uid,
      });
    },
    []
  );

  console.log(showPhoneNumber, "qqwqwe");

  return (
    <IonItem>
      <IonToggle
        onIonChange={onChange}
        checked={showPhoneNumber}
        enableOnOffLabels
      >
        Visa mitt telefonnummer
      </IonToggle>
    </IonItem>
  );
}
