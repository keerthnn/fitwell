import { mkdir, writeFile } from "node:fs/promises";
import { workoutPlans } from "./data/workout-plans.mjs";

const root = new URL("../public/images/", import.meta.url);
const escape = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const slug = (value) =>
  value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const svg = (title, subtitle, accent = "#35c46a") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" role="img" aria-labelledby="title">
<title id="title">${escape(title)}</title><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#101827"/><stop offset="1" stop-color="#253552"/></linearGradient></defs>
<rect width="800" height="500" rx="32" fill="url(#g)"/><circle cx="650" cy="100" r="150" fill="${accent}" opacity=".18"/>
<path d="M110 315h580M180 255h440M250 195h300" stroke="${accent}" stroke-width="18" stroke-linecap="round" opacity=".75"/>
<text x="60" y="400" fill="white" font-family="system-ui,sans-serif" font-size="46" font-weight="700">${escape(title)}</text>
<text x="62" y="445" fill="#b8c4d8" font-family="system-ui,sans-serif" font-size="22">${escape(subtitle)}</text></svg>`;
const machineArt = {
  "Lat Pulldown": `<path d="M240 100h320M270 100v260M530 100v260M335 165h130M400 165v85M330 250h140M350 330h100" fill="none" stroke="#ffb84d" stroke-width="18" stroke-linecap="round"/>`,
  "Leg Press": `<path d="M220 340h180l120-180M400 340l120 35M500 140l105 80M500 140l-35-55" fill="none" stroke="#ffb84d" stroke-width="20" stroke-linecap="round"/>`,
  "Lying Leg Curl": `<path d="M170 280h370M220 280v90M480 280v90M540 280l80 65M600 330l45-45" fill="none" stroke="#ffb84d" stroke-width="20" stroke-linecap="round"/>`,
  "Standing Machine Calf Raise": `<path d="M260 100h280M290 100v270M510 100v270M350 170h100M400 170v135M330 360h140" fill="none" stroke="#ffb84d" stroke-width="20" stroke-linecap="round"/>`,
  "Pec Deck Fly": `<path d="M245 100v270M555 100v270M320 320h160M400 190v130M300 170l100 70 100-70" fill="none" stroke="#ffb84d" stroke-width="20" stroke-linecap="round"/>`,
};
const machineSvg = (title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" role="img" aria-labelledby="title"><title id="title">${escape(title)}</title><rect width="800" height="500" rx="32" fill="#101827"/>${machineArt[title]}<text x="50" y="445" fill="white" font-family="system-ui,sans-serif" font-size="42" font-weight="700">${escape(title)}</text></svg>`;

async function save(relative, content) {
  const target = new URL(relative, root);
  await mkdir(new URL("./", target), { recursive: true });
  await writeFile(target, content, "utf8");
}

await save("exercises/fallback.svg", svg("FitWell Exercise", "Neutral exercise image fallback"));
await save("workout-plans/fallback.svg", svg("Workout Plan", "FitWell training programme"));
for (const equipment of ["barbell", "dumbbell", "kettlebell", "machine", "bodyweight", "cable"]) {
  await save(`equipment/${equipment}.svg`, svg(`${equipment[0].toUpperCase()}${equipment.slice(1)}`, "Equipment fallback", "#4f8cff"));
}
for (const [side, groups] of Object.entries({
  front: ["chest", "biceps", "shoulders", "quadriceps", "abs", "forearms"],
  back: ["back", "triceps", "hamstrings", "calves", "glutes", "traps"],
})) {
  for (const group of groups) await save(`muscles/${side}/${group}.svg`, svg(group, `${side} muscle group`, "#ef6c62"));
}
for (const item of workoutPlans) {
  await save(`workout-plans/${item.slug}.svg`, svg(item.name, "Built-in FitWell Workout Plan"));
}
for (const name of new Set(workoutPlans.flatMap((item) => item.exercises))) {
  const machine = ["Lat Pulldown", "Leg Press", "Lying Leg Curl", "Standing Machine Calf Raise", "Pec Deck Fly"].includes(name);
  await save(`exercises/featured/${slug(name)}.svg`, machine ? machineSvg(name) : svg(name, "Exercise reference", "#35c46a"));
}
console.log("Generated original FitWell Version 1 SVG assets.");
