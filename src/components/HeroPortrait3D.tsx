"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const HeroProfileModelScene = dynamic(
  () => import("@/components/HeroProfileModelScene").then((mod) => mod.HeroProfileModelScene),
  { ssr: false },
);

type Props = {
  src?: string | null;
  modelSrc?: string | null;
  alt: string;
  className?: string;
};

const frameClass =
  "relative h-[200px] w-[200px] sm:h-[230px] sm:w-[230px] lg:h-[260px] lg:w-[260px]";

function PortraitFrame({ children }: { children: ReactNode }) {
  return (
    <div className={cn(frameClass, "isolate shrink-0")}>
      <div
        className="pointer-events-none absolute -inset-3 rounded-full bg-primary/5 blur-2xl"
        aria-hidden
      />
      <div className="relative h-full w-full rounded-full border border-primary/15 bg-gradient-to-b from-primary/5 to-primary/10 p-1.5 shadow-[0_20px_50px_-30px_hsl(var(--primary)/0.2)]">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          {children}
        </div>
      </div>
    </div>
  );
}

const portraitMediaClass =
  "mx-auto h-full w-full max-w-none origin-bottom scale-[1.14] object-contain object-bottom";

function ImagePortrait({ src, alt }: { src: string; alt: string }) {
  return (
    <PortraitFrame>
      <img src={src} alt={alt} className={portraitMediaClass} fetchPriority="high" decoding="async" />
    </PortraitFrame>
  );
}

function PortraitCaption({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-center text-[11px] text-muted-foreground">{children}</p>;
}

export function HeroPortrait3D({ src, modelSrc, alt, className }: Props) {
  const image = src?.trim() || "";
  const model = modelSrc?.trim() || "";
  const [modelReady, setModelReady] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const showModel = Boolean(model && !image && !modelFailed);

  useEffect(() => {
    setModelReady(false);
    setModelFailed(false);
  }, [model, image]);

  if (showModel) {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <PortraitFrame>
          <div className="relative h-full w-full">
            {!modelReady ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-foreground/70" />
              </div>
            ) : null}
            <HeroProfileModelScene
              url={model}
              className="absolute inset-0 z-10 h-full w-full"
              onReady={() => setModelReady(true)}
              onError={() => setModelFailed(true)}
            />
          </div>
        </PortraitFrame>
      </div>
    );
  }

  if (modelFailed && image) {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <ImagePortrait
          src={image}
          alt={alt}
        />
        <PortraitCaption>3D model failed — showing photo</PortraitCaption>
      </div>
    );
  }

  if (!image) return null;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <ImagePortrait
        src={image}
        alt={alt}
      />
    </div>
  );
}
