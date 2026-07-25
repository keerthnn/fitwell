import { FitnessCenter } from "@mui/icons-material";
import { Box } from "@mui/material";
import type { ImageCandidate } from "fitness/lib/images/assetRegistry";
import { useMemo, useState } from "react";

interface FitWellImageProps {
  candidates: ImageCandidate[];
  alt: string;
  aspectRatio?: string;
  objectFit?: "contain" | "cover";
  height?: number | string;
}

export const nextImageIndex = (current: number, total: number) =>
  current < total - 1 ? current + 1 : null;

export default function FitWellImage({
  candidates,
  alt,
  aspectRatio = "1 / 1",
  objectFit = "contain",
  height,
}: FitWellImageProps) {
  const key = useMemo(
    () => candidates.map((candidate) => candidate.src).join("|"),
    [candidates],
  );
  const [state, setState] = useState({ key, index: 0, exhausted: false });
  const current =
    state.key === key ? state : { key, index: 0, exhausted: false };

  const image = candidates[current.index];
  if (!image || current.exhausted) {
    return (
      <Box
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        sx={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height,
          aspectRatio: height ? undefined : aspectRatio,
          bgcolor: "action.hover",
          color: "text.secondary",
        }}
      >
        <FitnessCenter sx={{ fontSize: 48 }} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={image.src}
      srcSet={image.srcSet}
      sizes="(max-width: 600px) 256px, 512px"
      alt={alt}
      onError={() => {
        const next = nextImageIndex(current.index, candidates.length);
        setState({
          key,
          index: next ?? current.index,
          exhausted: next === null,
        });
      }}
      sx={{
        display: "block",
        width: "100%",
        height,
        aspectRatio: height ? undefined : aspectRatio,
        objectFit,
        objectPosition: "center",
        bgcolor: "action.hover",
      }}
    />
  );
}
