"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.log("Service workers are not supported.");
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Disaster Response service worker registered:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error(
          "Disaster Response service worker registration failed:",
          error
        );
      });
  }, []);

  return null;
}