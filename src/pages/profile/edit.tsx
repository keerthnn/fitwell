import {
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  createProfile,
  getUserProfile,
  updateProfile,
} from "fitness/utils/spec";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProfileEdit() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileExisted, setProfileExisted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    heightCm: "",
    weightKg: "",
    goal: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      const profile = await getUserProfile();
      if (profile) {
        setProfileExisted(true);
        setForm({
          firstName: profile.firstName,
          lastName: profile.lastName,
          gender: profile.gender || "",
          age: profile.age ? String(profile.age) : "",
          heightCm: profile.heightCm ? String(profile.heightCm) : "",
          weightKg: profile.weightKg ? String(profile.weightKg) : "",
          goal: profile.goal || "",
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      goal: form.goal,
    };

    if (profileExisted) {
      await updateProfile(payload);
      router.push("/profile");
    } else {
      await createProfile(payload);
      router.push("/dashboard");
    }
  }

  if (loading) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 4, sm: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
          }}
        >
          <Stack spacing={4}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {form.firstName ? "Edit Your Profile" : "Complete Your Profile"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Help us personalize your experience and track progress
                effectively
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Personal Information
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        label="First Name"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        required
                        fullWidth
                      />

                      <TextField
                        label="Last Name"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        required
                        fullWidth
                      />
                    </Stack>

                    <FormControl fullWidth>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select
                        labelId="gender-label"
                        label="Gender"
                        value={form.gender}
                        onChange={(e) =>
                          setForm({ ...form, gender: e.target.value })
                        }
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="prefer_not_to_say">
                          Prefer not to say
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      label="Age"
                      type="number"
                      value={form.age}
                      onChange={(e) =>
                        setForm({ ...form, age: e.target.value })
                      }
                      inputProps={{ min: 13, max: 120 }}
                      fullWidth
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Physical Profile
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="Height"
                      type="number"
                      value={form.heightCm}
                      onChange={(e) =>
                        setForm({ ...form, heightCm: e.target.value })
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">cm</InputAdornment>
                        ),
                      }}
                      inputProps={{ min: 100, max: 250, step: 0.1 }}
                      fullWidth
                    />

                    <TextField
                      label="Weight"
                      type="number"
                      value={form.weightKg}
                      onChange={(e) =>
                        setForm({ ...form, weightKg: e.target.value })
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">kg</InputAdornment>
                        ),
                      }}
                      inputProps={{ min: 30, max: 300, step: 0.1 }}
                      fullWidth
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Your Goal
                  </Typography>
                  <TextField
                    label="Primary Fitness Goal"
                    value={form.goal}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                    placeholder="e.g., Build muscle, lose weight, improve endurance"
                    multiline
                    rows={2}
                    fullWidth
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Save Profile
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
