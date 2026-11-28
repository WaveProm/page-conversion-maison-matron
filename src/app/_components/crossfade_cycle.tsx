import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "./crossfade_cycle.module.css";

type crossfade_cycle_props = {
  sources: readonly [string, string];
  still: 0 | 1;
  width: number;
  height: number;
  alt: string;
  sizes: string;
};

export const CrossfadeCycle = ({
  sources,
  still,
  width,
  height,
  alt,
  sizes,
}: crossfade_cycle_props) => (
  <figure className={cn("grid", styles.cycle)}>
    {sources.map((src, index) => (
      <Image
        key={src}
        src={src}
        width={width}
        height={height}
        alt={index === 0 ? alt : ""}
        sizes={sizes}
        data-still={index === still || undefined}
        className="col-start-1 row-start-1"
      />
    ))}
  </figure>
);
