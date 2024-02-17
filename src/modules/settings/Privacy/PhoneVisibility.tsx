import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import {
  IUserWithPhoneAndSocial,
  profileService,
} from "@/services/profile.service";
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
    queryKey: [QueryKeys.ProfileWithRelations, user?.id],
    networkMode: "offlineFirst",
    queryFn: async () => {
      const profile = await profileService.fetchProfile(user!.id);

      return profile;
    },
  });
  const updateShowPhoneNumber = useMutation<void, void, IMutationVariables>({
    mutationFn: async ({ checked, userUid }) => {
      return profileService.updateProfile(userUid, {
        showPhoneNumber: checked,
      });
    },
    onSuccess(data, variables) {
      const qKey = [QueryKeys.ProfileWithRelations, user?.id];

      queryClient.setQueryData<IUserWithPhoneAndSocial>(qKey, (v) => {
        return {
          ...v,
          showPhoneNumber: variables.checked,
        } as IUserWithPhoneAndSocial;
      });
    },
  });

  const onChange = useCallback(
    async (e: IonToggleCustomEvent<ToggleChangeEventDetail<boolean>>) => {
      await updateShowPhoneNumber.mutateAsync({
        checked: e.target.checked,
        userUid: user!.id,
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
