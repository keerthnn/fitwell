import { DeleteOutline } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { deleteWorkout } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { useState } from "react";

export default function DeleteWorkoutButton({
  workoutId,
  workoutName,
  compact = false,
  onDeleted,
}: {
  workoutId: string;
  workoutName: string;
  compact?: boolean;
  onDeleted?: () => void | Promise<void>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function confirmDelete() {
    setError("");
    setIsDeleting(true);
    try {
      await deleteWorkout(workoutId);
      if (onDeleted) {
        await onDeleted();
        setOpen(false);
        setIsDeleting(false);
      } else {
        await router.push("/workouts");
      }
    } catch {
      setError("The workout could not be deleted. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      {compact ? (
        <Tooltip title="Delete workout">
          <IconButton
            color="error"
            aria-label={`Delete ${workoutName}`}
            onClick={() => setOpen(true)}
          >
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          color="error"
          variant="outlined"
          startIcon={<DeleteOutline />}
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      )}
      <Dialog
        open={open}
        onClose={() => {
          if (!isDeleting) setOpen(false);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete workout?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            “{workoutName}” and all of its sets will be permanently deleted.
            This action cannot be undone.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={isDeleting} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={isDeleting}
            onClick={() => void confirmDelete()}
          >
            {isDeleting ? "Deleting…" : "Delete workout"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
