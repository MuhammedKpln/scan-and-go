import { auth } from "@/services/firebase.service";
import { useIonAlert } from "@ionic/react";
import { useSignOut } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./ExploreContainer.css";

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const [showAlert, hideAlert] = useIonAlert();
  const [signOut, loading, error] = useSignOut(auth);
  const history = useHistory();

  return (
    <div className="container">
      <strong>{name}</strong>
      <button onClick={() => showAlert("selam")}>click me</button>
      <button
        onClick={async () => {
          await signOut();
          history.push("/");
        }}
      >
        lgoout
      </button>
      <p>
        Explore
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://ionicframework.com/docs/components"
        >
          UI Components
        </a>
      </p>
    </div>
  );
};

export default ExploreContainer;
