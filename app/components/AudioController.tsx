"use client";

import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useFocusStore } from "@/app/store/useFocusStore";

const AMBIENCE_URL =
  "/sounds/752264__geoff-bremner-audio__live-formula-1-racing.wav";

/** Low F1 ambience that starts on "Start Engine" and obeys the mute toggle. */
export function AudioController() {
  const started = useFocusStore((s) => s.started);
  const muted = useFocusStore((s) => s.muted);
  const howl = useRef<Howl | null>(null);

  useEffect(() => {
    if (!started) return;
    const sound = new Howl({
      src: [AMBIENCE_URL],
      loop: true,
      volume: 0,
      html5: true,
    });
    howl.current = sound;
    sound.play();
    sound.fade(0, 0.25, 1500);
    return () => {
      sound.stop();
      sound.unload();
      howl.current = null;
    };
  }, [started]);

  useEffect(() => {
    howl.current?.mute(muted);
  }, [muted]);

  return null;
}
