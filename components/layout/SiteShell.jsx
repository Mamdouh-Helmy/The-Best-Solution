"use client";

import { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import SmoothScroll from "./SmoothScroll";

export default function SiteShell({ children }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onFinish={() => setLoaded(true)} />}
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}