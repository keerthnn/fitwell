import { Component, type ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import type { MuscleGroup } from "fitness/utils/exerciseDiscovery";
import { backBodyRegions, bodySilhouette, frontBodyRegions } from "fitness/components/exercise-discovery/bodyGeometry";

export class BodyFigureBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function BodyFigure({ side, selected, onToggle }: {
  side: "front" | "back";
  selected: MuscleGroup[];
  onToggle: (group: MuscleGroup) => void;
}) {
  const theme = useTheme();
  return (
    <svg viewBox="0 0 240 500" width="100%" preserveAspectRatio="xMidYMid meet"
      role="group" aria-label={`${side === "front" ? "Front" : "Back"} muscle selection body`}
      style={{ display: "block", maxWidth: 290 }}>
      <title>{`${side === "front" ? "Front" : "Back"} human body muscle selector`}</title>
      <g fill="#737b85" stroke="#e2e8f0" strokeWidth="2" strokeLinejoin="round">
        {bodySilhouette.map((path) => <path key={path} d={path} />)}
      </g>
      {(side === "front" ? frontBodyRegions : backBodyRegions).map((region) => {
        const isSelected = selected.includes(region.group);
        return (
          <g key={region.group} className="muscle-region" role="button" tabIndex={0}
            aria-label={`${region.group} muscle on ${side} body`} aria-pressed={isSelected}
            onClick={() => onToggle(region.group)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (event.key === "Enter" && !event.repeat) onToggle(region.group);
              }
            }}
            onKeyUp={(event) => {
              if (event.key === " ") {
                event.preventDefault();
                onToggle(region.group);
              }
            }}>
            <title>{region.group}</title>
            {[false, true].map((mirrored) => (
              <g key={String(mirrored)} transform={mirrored ? "translate(240 0) scale(-1 1)" : undefined}>
                {region.paths.map((path) => (
                  <path key={path} d={path} fill={isSelected ? theme.palette.primary.main : "#94a3b8"}
                    stroke={isSelected ? "#ffffff" : "#e2e8f0"} strokeWidth={isSelected ? 2.5 : 1.5}
                    strokeLinejoin="round" />
                ))}
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
