import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { createWorkout } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateWorkout() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [durationM, setDurationM] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await createWorkout({
        title: title || undefined,
        date: new Date(date),
        durationM: durationM ? parseInt(durationM) : undefined,
        notes: notes || undefined,
      });
      router.push(`/workouts/${result.id}/edit`);
    } catch (error) {
      console.error("Failed to create workout:", error);
      alert("Failed to create workout");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Workout
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
          <TextField
            label="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Push Day, Legs A"
          />

          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Duration (minutes, optional)"
            type="number"
            value={durationM}
            onChange={(e) => setDurationM(e.target.value)}
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading || !date}
          >
            {loading ? "Creating..." : "Create Workout"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
