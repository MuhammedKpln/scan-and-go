import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useIonRouter } from "@ionic/react";
import { useEffect } from "react";

const AppUrlListener: React.FC = () => {
  const history = useIonRouter();

  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      const urlParser = new URL(event.url);

      console.log(urlParser);

      if (urlParser?.pathname) {
        history.push(urlParser.pathname);
      }

      // Example url: https://beerswift.app/tabs/tab2
      // slug = /tabs/tab2
      // const slug = event.url.split(".app").pop();
      // if (slug) {
      //   history.push(slug);
      // }
      // If no match, do nothing - let regular routing
      // logic take over
    });
  }, []);

  return null;
};

export default AppUrlListener;
