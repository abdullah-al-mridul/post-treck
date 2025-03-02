import React from "react";
import NotiClient from "@/components/notification/NotiClient";
export const metadata = {
  title: "Notifications",
  description: "Notifications",
};
const Notifications = () => {
  return (
    <div>
      <NotiClient />
    </div>
  );
};

export default Notifications;
