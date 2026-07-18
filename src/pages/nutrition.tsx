import { Add, ChevronLeft, ChevronRight, Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import {
  deleteNutritionEntry,
  getNutritionDay,
  saveNutritionEntry,
} from "fitness/utils/spec";
import { DailyNutritionSummary } from "fitness/utils/types";
import { useCallback, useEffect, useState } from "react";

const empty = {
  foodName: "",
  calories: "",
  mealType: "BREAKFAST",
  proteinG: "",
  carbsG: "",
  fatG: "",
};
export default function NutritionPage() {
  const [date, setDate] = useState(() => new Date());
  const [data, setData] = useState<DailyNutritionSummary | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    try {
      setData(await getNutritionDay(start, end));
      setError("");
    } catch {
      setError("Could not load nutrition entries.");
    }
  }, [date]);
  useEffect(() => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    getNutritionDay(start, end)
      .then(setData)
      .catch(() => setError("Could not load nutrition entries."));
  }, [date]);
  const move = (days: number) =>
    setDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + days);
      return next;
    });
  async function save() {
    const consumedAt = new Date(date);
    consumedAt.setHours(12, 0, 0, 0);
    await saveNutritionEntry({
      consumedAt: consumedAt.toISOString(),
      mealType: form.mealType as never,
      foodName: form.foodName,
      calories: Number(form.calories),
      proteinG: form.proteinG ? Number(form.proteinG) : null,
      carbsG: form.carbsG ? Number(form.carbsG) : null,
      fatG: form.fatG ? Number(form.fatG) : null,
    });
    setOpen(false);
    setForm(empty);
    await load();
  }
  return (
    <AuthenticatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4">Nutrition</Typography>
              <Typography color="text.secondary">
                Manual calorie and macro tracking.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
            >
              Add food
            </Button>
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <IconButton onClick={() => move(-1)}>
              <ChevronLeft />
            </IconButton>
            <Typography fontWeight={600}>
              {date.toLocaleDateString(undefined, { dateStyle: "full" })}
            </Typography>
            <IconButton onClick={() => move(1)}>
              <ChevronRight />
            </IconButton>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          {data && (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" },
                  gap: 2,
                }}
              >
                {[
                  ["Consumed", data.consumed],
                  ["Burned", data.burned],
                  ["Net", data.net],
                  ["Remaining", data.remaining],
                ].map(([label, value]) => (
                  <Paper key={label} sx={{ p: 3 }}>
                    <Typography variant="h5">{value} kcal</Typography>
                    <Typography color="text.secondary">{label}</Typography>
                  </Paper>
                ))}
              </Box>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                  Food log
                </Typography>
                {data.entries.length ? (
                  <Stack spacing={2}>
                    {data.entries.map((entry) => (
                      <Stack
                        key={entry.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography fontWeight={600}>
                            {entry.foodName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {entry.mealType.replaceAll("_", " ")} · P{" "}
                            {entry.proteinG ?? 0}g · C {entry.carbsG ?? 0}g · F{" "}
                            {entry.fatG ?? 0}g
                          </Typography>
                        </Box>
                        <Stack direction="row" alignItems="center">
                          <Typography>{entry.calories} kcal</Typography>
                          <IconButton
                            color="error"
                            onClick={async () => {
                              await deleteNutritionEntry(entry.id);
                              await load();
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    No entries for this day.
                  </Typography>
                )}
              </Paper>
            </>
          )}
        </Stack>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add food</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Food name"
                value={form.foodName}
                onChange={(e) => setForm({ ...form, foodName: e.target.value })}
              />
              <TextField
                select
                label="Meal"
                value={form.mealType}
                onChange={(e) => setForm({ ...form, mealType: e.target.value })}
              >
                {[
                  "BREAKFAST",
                  "LUNCH",
                  "DINNER",
                  "SNACK",
                  "PRE_WORKOUT",
                  "POST_WORKOUT",
                  "OTHER",
                ].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Calories"
                type="number"
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })}
              />
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Protein g"
                  type="number"
                  value={form.proteinG}
                  onChange={(e) =>
                    setForm({ ...form, proteinG: e.target.value })
                  }
                />
                <TextField
                  label="Carbs g"
                  type="number"
                  value={form.carbsG}
                  onChange={(e) => setForm({ ...form, carbsG: e.target.value })}
                />
                <TextField
                  label="Fat g"
                  type="number"
                  value={form.fatG}
                  onChange={(e) => setForm({ ...form, fatG: e.target.value })}
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              disabled={!form.foodName || !form.calories}
              onClick={save}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AuthenticatedPage>
  );
}
