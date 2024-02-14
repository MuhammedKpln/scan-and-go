import { Swiper, SwiperSlide } from "swiper/react";
import IsInstalledNatively from "./IsInstalledNatively";

import React, { useMemo } from "react";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Virtual } from "swiper/modules";
import IsAllowedNotification from "./IsAllowedNotifications";

export default function UserAlerts() {
  const components = useMemo<React.FC[]>(
    () => [IsInstalledNatively, IsAllowedNotification],
    []
  );

  return (
    <Swiper
      modules={[Virtual, Pagination]}
      virtual
      pagination={{ dynamicBullets: true }}
    >
      {components.map((component, index) => {
        const elComponent = component({});

        if (elComponent) {
          return (
            <SwiperSlide virtualIndex={index} key={index}>
              {component}
            </SwiperSlide>
          );
        }
      })}
    </Swiper>
  );
}
