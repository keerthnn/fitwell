import { DeleteOutline } from "fitness/components/common/icons";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { deleteWorkoutPlan } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { useState } from "react";

export default function DeleteWorkoutPlanButton({
  planId,
  planName,
}: {
  planId: string;
  planName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  function openDialog() {
    setError("");
    setOpen(true);
  }

  function closeDialog() {
    if (!isDeleting) setOpen(false);
  }

  async function confirmDelete() {
    if (isDeleting) return;
    setError("");
    setIsDeleting(true);
    try {
      await deleteWorkoutPlan(planId);
      await router.push("/workout-plans");
    } catch {
      setError("The workout plan could not be deleted. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        color="error"
        variant="outlined"
        startIcon={<DeleteOutline />}
        onClick={openDialog}
      >
        Delete plan
      </Button>
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete workout plan?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            “{planName}” and its exercise prescriptions will be permanently
            deleted. This action cannot be undone.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={isDeleting} onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={isDeleting}
            onClick={() => void confirmDelete()}
          >
            {isDeleting ? "Deleting…" : "Delete plan"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
