import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { IUser } from "@/models/user.model";
import {
  IUserWithPhoneAndSocial,
  profileService,
} from "@/services/profile.service";
import { IonToggleCustomEvent } from "@ionic/core";
import {
  IonItem,
  IonSkeletonText,
  IonToggle,
  ToggleChangeEventDetail,
} from "@ionic/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface IMutationVariables {
  userUid: string;
  checked: boolean;
}

export default function AllowMessages() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const query = useQuery<IUser>({
    queryKey: [QueryKeys.ProfileWithRelations, user?.id],
    networkMode: "offlineFirst",
    queryFn: () => profileService.fetchProfile(user!.id),
  });

  const updateShowMessages = useMutation<void, void, IMutationVariables>({
    mutationFn: async ({ checked, userUid }) => {
      return profileService.updateProfile(userUid, {
        sendMessageAllowed: checked,
      });
    },
    onSuccess(_data, variables) {
      const qKeyWithRelations = [QueryKeys.ProfileWithRelations, user?.id];

      queryClient.setQueryData<IUserWithPhoneAndSocial>(
        qKeyWithRelations,
        (v) => {
          return {
            ...v,
            sendMessageAllowed: variables.checked,
          } as IUserWithPhoneAndSocial;
        }
      );
    },
  });

  const onChange = useCallback(
    async (e: IonToggleCustomEvent<ToggleChangeEventDetail<boolean>>) => {
      await updateShowMessages.mutateAsync({
        checked: e.target.checked,
        userUid: user!.id,
      });
    },
    []
  );

  if (query.isLoading) {
    return <IonSkeletonText animated={true} className="h-5" />;
  }

  return (
    <IonItem>
      <IonToggle
        onIonChange={onChange}
        checked={query.data?.sendMessageAllowed}
        enableOnOffLabels
      >
        Tillåt sändning av meddelanden
      </IonToggle>
    </IonItem>
  );
}
