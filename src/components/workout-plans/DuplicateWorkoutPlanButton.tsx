import { ContentCopy } from "fitness/components/common/icons";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { duplicateWorkoutPlan } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";

export default function DuplicateWorkoutPlanButton({
  planId,
  planName,
  disabled = false,
}: {
  planId: string;
  planName: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isDuplicating, setIsDuplicating] = useState(false);

  function openDialog() {
    setName(`${planName} Copy`);
    setNameError("");
    setRequestError("");
    setOpen(true);
  }

  function closeDialog() {
    if (!isDuplicating) setOpen(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isDuplicating) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Plan name is required.");
      return;
    }
    if (trimmedName.length > 120) {
      setNameError("Plan name must be 120 characters or fewer.");
      return;
    }

    setNameError("");
    setRequestError("");
    setIsDuplicating(true);
    let copy;
    try {
      copy = await duplicateWorkoutPlan(planId, trimmedName);
    } catch {
      setRequestError(
        "The workout plan could not be duplicated. Please try again.",
      );
      setIsDuplicating(false);
      return;
    }

    setOpen(false);
    setIsDuplicating(false);
    try {
      await router.push(`/workout-plans/${copy.id}`);
    } catch {
      setRequestError(
        "The plan was duplicated, but it could not be opened. Find it in your workout-plan library.",
      );
      setOpen(true);
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ContentCopy />}
        disabled={disabled}
        onClick={openDialog}
      >
        Duplicate plan
      </Button>
      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="xs"
      >
        <Box
          component="form"
          aria-label="Duplicate workout plan"
          onSubmit={(event) => void submit(event)}
        >
          <DialogTitle>Duplicate workout plan</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" mb={1}>
              Choose a name for your private copy.
            </Typography>
            <TextField
              autoFocus
              required
              label="Plan name"
              value={name}
              error={Boolean(nameError)}
              helperText={nameError || `${name.trim().length}/120`}
              onChange={(event) => {
                setName(event.target.value);
                if (nameError) setNameError("");
              }}
            />
            {requestError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {requestError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button disabled={isDuplicating} onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isDuplicating}
            >
              {isDuplicating ? "Duplicating…" : "Duplicate plan"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
