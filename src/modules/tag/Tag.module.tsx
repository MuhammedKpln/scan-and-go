import AppLoading from "@/components/App/AppLoading";
import { TagDetailPageProps } from "@/pages/Tag/Tag";
import styles from "@/pages/Tag/Tag.module.scss";
import { profileService } from "@/services/profile.service";
import { tagService } from "@/services/tag.service";
import { IonItem, IonLabel, IonList, IonText } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";

export default function TagModule(props: TagDetailPageProps) {
  const tagQuery = useQuery({
    queryKey: ["tag", props.match.params.tagUid],
    queryFn: () => {
      return tagService.fetchTag(props.match.params.tagUid);
    },
  });

  const profileQuery = useQuery({
    enabled: !!tagQuery.data?.data()?.userUid,
    queryKey: ["profile", tagQuery.data?.data()?.userUid],
    queryFn: () => {
      return profileService.fetchProfile(tagQuery.data!.data()!.userUid);
    },
  });

  if (tagQuery.isLoading || profileQuery.isLoading) {
    return <AppLoading message="Loading tag..." />;
  }

  const profileData = profileQuery.data?.data();

  return (
    <div className="flex flex-col justify-around items-center text-center h-full w-full">
      <div id="userDetails" className="">
        <img
          src={profileData?.profileImageRef?.toString()}
          className="w-32 h-32 rounded-full"
        />

        <h1>
          {profileData?.firstName?.toString()}
          {profileData?.lastName?.toString()}
        </h1>
        <IonText color="medium">{profileData?.bio?.toString()}</IonText>
      </div>

      <div id="userQr" className={styles.qrCodeContainer}>
        <img
          src="https://docs.lightburnsoftware.com/img/QRCode/ExampleCode.png"
          className="w-36 h-36"
        />
      </div>

      <IonList inset className="w-full">
        <IonItem>
          <IonLabel>
            <p>Phone</p>
            <h6>
              <a href="tel:+1 000-000-000">+1 000-000-000</a>
            </h6>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <p>Email</p>
            <h6>
              <a href="mailto:email@address.com">email@address.com</a>
            </h6>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <p>Website</p>
            <h6>
              <a
                href="http://www.yoursite.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.yoursite.com
              </a>
            </h6>
          </IonLabel>
        </IonItem>
      </IonList>
    </div>
  );
}
