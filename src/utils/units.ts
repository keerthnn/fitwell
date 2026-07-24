import type { UnitSystem } from "fitness/utils/types";

const POUNDS_PER_KILOGRAM = 2.2046226218;
const CENTIMETERS_PER_INCH = 2.54;

export const displayWeight = (kilograms: number, units: UnitSystem) =>
  units === "IMPERIAL" ? kilograms * POUNDS_PER_KILOGRAM : kilograms;
export const canonicalWeight = (value: number, units: UnitSystem) =>
  units === "IMPERIAL" ? value / POUNDS_PER_KILOGRAM : value;
export const displayHeight = (centimeters: number, units: UnitSystem) =>
  units === "IMPERIAL" ? centimeters / CENTIMETERS_PER_INCH : centimeters;
export const canonicalHeight = (value: number, units: UnitSystem) =>
  units === "IMPERIAL" ? value * CENTIMETERS_PER_INCH : value;
export const formatWeight = (kilograms: number, units: UnitSystem) =>
  `${displayWeight(kilograms, units).toFixed(1)} ${units === "IMPERIAL" ? "lb" : "kg"}`;
export const formatHeight = (centimeters: number, units: UnitSystem) =>
  `${displayHeight(centimeters, units).toFixed(1)} ${units === "IMPERIAL" ? "in" : "cm"}`;
