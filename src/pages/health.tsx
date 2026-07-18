import { Add, Delete } from "@mui/icons-material";
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import {
  deleteHealthRecord,
  getHealthRecords,
  saveHealthRecord,
} from "fitness/utils/spec";
import { Injury, MedicalCondition } from "fitness/utils/types";
import { useCallback, useEffect, useState } from "react";

export default function HealthPage() {
  const [tab, setTab] = useState<"condition" | "injury">("injury");
  const [data, setData] = useState<{
    conditions: MedicalCondition[];
    injuries: Injury[];
  }>({ conditions: [], injuries: [] });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bodyRegion: "",
    status: "ACTIVE",
    painLevel: "",
    notes: "",
  });
  const load = useCallback(() => getHealthRecords().then(setData), []);
  useEffect(() => {
    void load();
  }, [load]);
  async function save() {
    await saveHealthRecord(
      tab === "injury"
        ? {
            type: "injury",
            name: form.name,
            bodyRegion: form.bodyRegion,
            status: form.status,
            side: "NOT_APPLICABLE",
            painLevel: form.painLevel ? Number(form.painLevel) : null,
            notes: form.notes || null,
            exercisesToAvoid: [],
            contraindicationTags: [],
          }
        : {
            type: "condition",
            name: form.name,
            status: form.status === "RECOVERING" ? "MANAGED" : form.status,
            notes: form.notes || null,
          },
    );
    setOpen(false);
    setForm({
      name: "",
      bodyRegion: "",
      status: "ACTIVE",
      painLevel: "",
      notes: "",
    });
    await load();
  }
  const records = tab === "injury" ? data.injuries : data.conditions;
  return (
    <AuthenticatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Health & safety</Typography>
            <Typography color="text.secondary">
              Private notes that help you make safer exercise choices.
            </Typography>
          </Box>
          <Alert severity="info">
            FitWell is not a medical service and does not provide diagnosis or
            treatment. Consult a qualified clinician about health concerns.
          </Alert>
          <Stack direction="row" justifyContent="space-between">
            <Tabs value={tab} onChange={(_, value) => setTab(value)}>
              <Tab value="injury" label="Injuries" />
              <Tab value="condition" label="Medical conditions" />
            </Tabs>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Add
            </Button>
          </Stack>
          {records.length ? (
            records.map((record) => (
              <Paper key={record.id} sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6">{record.name}</Typography>
                    <Typography color="text.secondary">
                      {record.status}
                      {"bodyRegion" in record
                        ? ` · ${record.bodyRegion}${record.painLevel ? ` · pain ${record.painLevel}/10` : ""}`
                        : ""}
                    </Typography>
                    {record.notes && (
                      <Typography mt={1}>{record.notes}</Typography>
                    )}
                  </Box>
                  <IconButton
                    color="error"
                    onClick={async () => {
                      await deleteHealthRecord(record.id, tab);
                      await load();
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </Paper>
            ))
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                No {tab === "injury" ? "injuries" : "conditions"} recorded.
              </Typography>
            </Paper>
          )}
        </Stack>
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Add {tab}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {tab === "injury" && (
                <>
                  <TextField
                    label="Body region"
                    value={form.bodyRegion}
                    onChange={(e) =>
                      setForm({ ...form, bodyRegion: e.target.value })
                    }
                  />
                  <TextField
                    label="Pain level (1–10)"
                    type="number"
                    value={form.painLevel}
                    onChange={(e) =>
                      setForm({ ...form, painLevel: e.target.value })
                    }
                  />
                </>
              )}
              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {(tab === "injury"
                  ? ["ACTIVE", "RECOVERING", "RESOLVED"]
                  : ["ACTIVE", "MANAGED", "RESOLVED"]
                ).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                multiline
                rows={3}
                label="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              disabled={!form.name || (tab === "injury" && !form.bodyRegion)}
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
