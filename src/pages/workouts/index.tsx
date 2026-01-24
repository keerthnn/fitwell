// pages/workouts/index.tsx
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { getWorkouts } from "fitness/utils/spec";
import { WorkoutListItem } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Workouts() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error("Failed to load workouts:", error);
      alert("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">Workouts</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/workouts/create")}
          >
            New Workout
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : workouts.length === 0 ? (
          <Typography color="text.secondary">
            No workouts yet. Create your first workout to get started.
          </Typography>
        ) : (
          <List>
            {workouts.map((workout) => (
              <ListItem key={workout.id} disablePadding>
                <ListItemButton
                  onClick={() => router.push(`/workouts/${workout.id}`)}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={workout.title || "Untitled Workout"}
                    secondary={
                      <>
                        {formatDate(workout.date)}
                        {" • "}
                        {workout.exerciseCount} exercise
                        {workout.exerciseCount !== 1 ? "s" : ""}
                        {workout.durationM && ` • ${workout.durationM}m`}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}
