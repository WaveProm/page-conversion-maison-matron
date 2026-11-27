"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { play_in_view, type play_in_view_settings } from "@/lib/play_in_view";

type framing =
  | { cover: true; poster: `/video/${string}` }
  | { cover?: false; poster: StaticImageData; label: string };

type autoplay_video_props = play_in_view_settings & { src: string } & framing;

export const AutoplayVideo = (props: autoplay_video_props) => {
  const { src, start_margin, pause_off_screen } = props;
  const video = useRef<HTMLVideoElement>(null);
  const [blocked, set_blocked] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    return play_in_view(
      element,
      { start_margin, pause_off_screen },
      set_blocked,
    );
  }, [start_margin, pause_off_screen]);

  return (
    <div className={props.cover ? "absolute inset-0" : "relative"}>
      <video
        ref={video}
        src={src}
        poster={props.cover ? props.poster : props.poster.src}
        width={props.cover ? undefined : props.poster.width}
        height={props.cover ? undefined : props.poster.height}
        preload="none"
        muted
        loop
        playsInline
        aria-label={props.cover ? undefined : props.label}
        aria-hidden={props.cover ? true : undefined}
        className={
          props.cover ? "size-full object-cover" : "block h-auto w-full"
        }
      />
      {blocked && (
        <button
          type="button"
          className="absolute inset-0 grid cursor-pointer place-items-center"
        >
          <span className="border border-paper/50 bg-ink/50 px-4 py-2 text-paper backdrop-blur-xs">
            Lire la vidéo
          </span>
        </button>
      )}
    </div>
  );
};
