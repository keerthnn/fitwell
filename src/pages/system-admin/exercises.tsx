import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AdminLayout } from "fitness/components/AdminLayout";
import {
  adminCreateExercise,
  adminDeleteExercise,
  adminUpdateExercise,
  getExercises,
} from "fitness/utils/spec";
import { Exercise } from "fitness/utils/types";
import { useEffect, useState } from "react";

const emptyForm: Partial<Exercise> = {
  name: "",
  equipment: "BARBELL",
  movement: "PUSH",
  category: "",
  region: "",
  isCompound: true,
};

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [form, setForm] = useState<Partial<Exercise>>(emptyForm);

  async function load() {
    setExercises(await getExercises());
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      const data = await getExercises();
      if (mounted) setExercises(data);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function submit() {
    if (form.id) {
      await adminUpdateExercise(form as Exercise);
    } else {
      await adminCreateExercise(form);
    }
    setForm(emptyForm);
    await load();
  }

  async function remove(id: string) {
    await adminDeleteExercise(id);
    await load();
  }

  return (
    <AdminLayout>
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Exercises
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage exercise database and configurations
              </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {form.id ? "Edit Exercise" : "Add New Exercise"}
              </Typography>
              <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                <TextField
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <TextField
                  label="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
                <TextField
                  label="Region"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                />
                <Button
                  variant="contained"
                  onClick={submit}
                  sx={{ minWidth: 120 }}
                >
                  {form.id ? "Update" : "Add"}
                </Button>
                {form.id && (
                  <Button
                    variant="outlined"
                    onClick={() => setForm(emptyForm)}
                    sx={{ minWidth: 100 }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Paper>

            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Equipment
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Movement
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Category
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exercises.map((e) => (
                    <TableRow
                      key={e.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>{e.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {e.equipment}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {e.movement}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {e.category}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button size="small" onClick={() => setForm(e)}>
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => remove(e.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </AdminLayout>
  );
}
