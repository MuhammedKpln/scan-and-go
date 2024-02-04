import AppLoading from "@/components/App/AppLoading";
import ProfileView from "@/components/ProfileView/ProfileView";
import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { TagDetailPageProps } from "@/pages/Tag/Tag";
import { noteService } from "@/services/note.service";
import { profileService } from "@/services/profile.service";
import { tagService } from "@/services/tag.service";
import { useIonAlert, useIonModal, useIonRouter } from "@ionic/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import SendMessageModule from "./send_message.module";

export default function TagModule(props: TagDetailPageProps) {
  const [showAlert] = useIonAlert();
  const router = useIonRouter();
  const { isSignedIn } = useAuthContext();

  const fetchTag = useCallback(() => {
    return tagService.fetchTag(props.match.params.tagUid);
  }, []);

  const tagQuery = useQuery({
    queryKey: [QueryKeys.Tag, props.match.params.tagUid],
    queryFn: fetchTag,
    networkMode: "online",
  });

  const fetchProfile = useCallback(() => {
    return profileService.fetchProfile(tagQuery?.data!.data()!.userUid);
  }, [tagQuery]);

  const sendMessage = useCallback(() => {
    showSendMessageModal({
      initialBreakpoint: 0.5,
    });
  }, []);

  const profileQuery = useQuery({
    queryKey: [QueryKeys.Profile, tagQuery?.data?.data()?.userUid],
    queryFn: fetchProfile,
    enabled: !!tagQuery?.data?.data()?.userUid && tagQuery.data.exists(),
    networkMode: "online",
  });

  const fetchPhoneNumber = useCallback(() => {
    return profileService.fetchPhoneNumber(tagQuery?.data!.data()!.userUid);
  }, [tagQuery]);

  const fetchSocialMediaAccounts = useCallback(() => {
    return profileService.fetchSocialMediaAccounts(
      tagQuery?.data!.data()!.userUid
    );
  }, [tagQuery]);

  const fetchLatestNotes = useCallback(() => {
    return noteService.fetchLatestNotes(tagQuery.data!.data()!.userUid);
  }, [tagQuery]);

  const [phoneQuery, socialMediaQuery, notesQuery] = useQueries({
    queries: [
      {
        queryKey: [QueryKeys.UserPhone, tagQuery?.data?.data()?.userUid],
        queryFn: fetchPhoneNumber,
        networkMode: "online",
        enabled:
          !!tagQuery?.data?.data()?.userUid &&
          tagQuery.data.exists() &&
          profileQuery.data?.data()?.showPhoneNumber,
      },
      {
        queryKey: [
          QueryKeys.UserSocialMediaAccounts,
          tagQuery?.data?.data()?.userUid,
        ],
        networkMode: "online",
        queryFn: fetchSocialMediaAccounts,
        enabled: !!tagQuery?.data?.data()?.userUid && tagQuery.data.exists(),
      },
      {
        networkMode: "online",
        queryKey: [QueryKeys.Notes, tagQuery?.data?.data()?.userUid],
        queryFn: fetchLatestNotes,
        enabled: !!tagQuery?.data?.data()?.userUid && tagQuery.data.exists(),
      },
    ],
  });

  const userLatestNote = useMemo(() => {
    if (notesQuery.isLoading) {
      return;
    }

    if (!notesQuery.data?.empty) {
      return notesQuery?.data?.docs[0].data().content;
    }

    return tagQuery?.data?.data()?.tagNote;
  }, [notesQuery, tagQuery]);

  const profileData = useMemo(() => profileQuery.data?.data(), [profileQuery]);
  const socialData = useMemo(
    () => socialMediaQuery.data?.data(),
    [socialMediaQuery]
  );
  const phoneData = useMemo(() => phoneQuery.data?.data(), [phoneQuery]);

  const [showSendMessageModal, hideSendMessageModal] = useIonModal(
    SendMessageModule,
    {
      onCancel: () => hideSendMessageModal(undefined, "cancel"),
      onConfirm: () => hideSendMessageModal(undefined, "confirm"),
      toUserUid: tagQuery?.data?.data()?.userUid,
      toUser: profileData,
    }
  );

  if (tagQuery.isLoading || profileQuery.isLoading) {
    return <AppLoading message="Loading tag..." />;
  }

  if (!tagQuery?.data?.exists()) {
    showAlert({
      message: "Kunde inte hitta taggen",
      buttons: [
        {
          text: "Ok",
          handler: () => router.push("/", "root", "replace"),
        },
      ],
    });

    return;
  }

  return (
    <ProfileView
      bioContent={userLatestNote!}
      bioText="Anteckning"
      profileData={profileData!}
      bioIsLoading={notesQuery.isLoading}
      onSendMessage={sendMessage}
      phoneData={phoneData}
      socialData={socialData}
      isSignedIn={isSignedIn}
      showPhone
      showSendMessageBtn
      showSocial
    />
  );
}
