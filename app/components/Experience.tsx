"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import { Hud } from "@/app/components/hud/Hud";
import { AudioController } from "@/app/components/AudioController";
import { useFocusStore } from "@/app/store/useFocusStore";

// R3F needs the browser (WebGL, window). Load the whole 3D scene client-only.
const ExperienceCanvas = dynamic(
  () =>
    import("@/app/components/scene/ExperienceCanvas").then(
      (m) => m.ExperienceCanvas,
    ),
  { ssr: false },
);

export function Experience() {
  // Dev-only hook so automated screenshots can drive the scene deterministically.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const s = useFocusStore.getState;
    (window as unknown as Record<string, unknown>).__portfolio = {
      start: () => s().start(),
      ready: () => s().setReady(),
      focus: (f: string) => s().setFocus(f as never),
      getFocus: () => s().focus,
    };
  }, []);

  return (
    <>
      <div className="canvas-root">
        <ExperienceCanvas />
      </div>
      <Hud />
      <LoadingScreen />
      <AudioController />
    </>
  );
}
