import { ContentCopy } from "@mui/icons-material";
import { Alert, Button, Container, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { copyTemplate, getSharedTemplate } from "fitness/utils/spec";
import { WorkoutTemplateDetail } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SharedTemplatePage() {
  const router = useRouter();
  const token = typeof router.query.token === "string" ? router.query.token : "";
  const [item, setItem] = useState<WorkoutTemplateDetail | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (token) getSharedTemplate(token).then(setItem).catch(() => setError("This shared template is unavailable.")); }, [token]);
  return <Container maxWidth="md" sx={{ py: 4 }}>
    {error && <Alert severity="error">{error}</Alert>}
    {!item && !error ? <LinearProgress /> : item && <Stack spacing={3}>
      <Paper sx={{ p: 4 }}><Typography variant="overline">Shared FitWell workout</Typography><Typography variant="h3">{item.title}</Typography><Typography color="text.secondary">By {item.owner.name || "FitWell user"}</Typography><Typography mt={2}>{item.description}</Typography><Button sx={{ mt: 3 }} variant="contained" startIcon={<ContentCopy />} onClick={async () => { try { const copied = await copyTemplate(item.id, token); router.push(`/templates/${copied.id}`); } catch { router.push(`/auth/sign-in?next=${encodeURIComponent(router.asPath)}`); } }}>Copy to my templates</Button></Paper>
      {item.exercises.map((target) => <Paper key={target.exerciseId} sx={{ p: 3 }}><Typography fontWeight={600}>{target.exercise?.name}</Typography><Typography color="text.secondary">{target.targetSets} sets × {target.minReps ?? "—"} reps · {target.restSeconds ?? "—"} sec rest</Typography></Paper>)}
    </Stack>}
  </Container>;
}
