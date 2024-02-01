import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { IUser } from "@/models/user.model";
import { profileService } from "@/services/profile.service";
import { IonToggleCustomEvent } from "@ionic/core";
import { IonItem, IonToggle, ToggleChangeEventDetail } from "@ionic/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface IMutationVariables {
  userUid: string;
  checked: boolean;
}

export default function PhoneVisibility() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QueryKeys.Profile, user?.uid],
    networkMode: "offlineFirst",
    queryFn: async () => {
      const profile = await profileService.fetchProfile(user!.uid);

      return profile.data();
    },
  });
  const updateShowPhoneNumber = useMutation<void, void, IMutationVariables>({
    mutationFn: async ({ checked, userUid }) => {
      return profileService.updateProfile(userUid, {
        showPhoneNumber: checked,
      });
    },
    onSuccess(data, variables, context) {
      const qKey = [QueryKeys.Profile, user?.uid];

      queryClient.setQueryData<IUser>(qKey, (v) => {
        return {
          ...v,
          showPhoneNumber: variables.checked,
        } as IUser;
      });
    },
  });

  const onChange = useCallback(
    async (e: IonToggleCustomEvent<ToggleChangeEventDetail<boolean>>) => {
      await updateShowPhoneNumber.mutateAsync({
        checked: e.target.checked,
        userUid: user!.uid,
      });
    },
    []
  );

  return (
    <IonItem>
      <IonToggle
        onIonChange={onChange}
        checked={query.data?.showPhoneNumber}
        enableOnOffLabels
      >
        Visa mitt telefonnummer
      </IonToggle>
    </IonItem>
  );
}
