import axios from "axios";
import {
  AddExercisePayload,
  CreateWorkoutPayload,
  Exercise,
  Profile,
  SaveSetsPayload,
  Workout,
  WorkoutListItem,
} from "./types";

export async function createUser(email: string, displayName: string) {
  const { data } = await axios.post("/api/auth/create-user", {
    email,
    displayName,
  });
  return data as { userName: string };
}

export async function createProfile(input: Profile) {
  const { data } = await axios.post("/api/user/create-profile", input);
  return data as { success: true };
}

export async function getProfileStatus() {
  const { data } = await axios.get("/api/user/get-profile-status");
  return data as { hasProfile: boolean };
}

export async function getUserProfile() {
  const { data } = await axios.get("/api/user/get-user-profile");
  return data as Profile | null;
}

export async function updateProfile(input: Profile) {
  const { data } = await axios.post("/api/user/update-profile", input);
  return data as { success: true };
}

export async function deleteProfile() {
  const { data } = await axios.delete("/api/user/delete-profile");
  return data as { success: true };
}

export async function createWorkout(payload: CreateWorkoutPayload) {
  const { data } = await axios.post("/api/workouts/create-workout", payload);
  return data as { id: string };
}
export async function getWorkouts() {
  const { data } = await axios.get("/api/workouts/get-workout");
  return data as WorkoutListItem[];
}

export async function getWorkoutById(workoutId: string) {
  const { data } = await axios.get("/api/workouts/get-workout-by-id", {
    params: { id: workoutId },
  });
  return data as Workout;
}

export async function deleteWorkout(workoutId: string) {
  const { data } = await axios.delete("/api/workouts/delete-workout", {
    params: { id: workoutId },
  });
  return data as { success: boolean };
}

export async function addExerciseToWorkout(
  workoutId: string,
  payload: AddExercisePayload,
) {
  const { data } = await axios.post("/api/workouts/add-exercise", {
    workoutId,
    ...payload,
  });
  return data as { id: string };
}

export async function deleteWorkoutExercises(workoutExerciseId: string) {
  const { data } = await axios.delete(
    "/api/workout-exercises/delete-workout-exercises",
    { params: { workoutExerciseId } },
  );
  return data as { success: boolean };
}

export async function saveWorkoutExercisesSets(
  workoutExerciseId: string,
  payload: SaveSetsPayload,
) {
  const { data } = await axios.post(
    "/api/workout-exercises/save-workout-exercises-sets",
    {
      workoutExerciseId,
      ...payload,
    },
  );
  return data as { success: boolean };
}

export async function getExercises(search?: string) {
  const { data } = await axios.get("/api/exercises/get-exercises", {
    params: search ? { search } : undefined,
  });
  return data as Exercise[];
}

export async function adminGetUsers() {
  const { data } = await axios.get("/api/admin/get-users");
  return data;
}

export async function adminCreateExercise(input: Partial<Exercise>) {
  const { data } = await axios.post("/api/admin/create-exercise", input);
  return data as Exercise;
}

export async function adminUpdateExercise(
  input: Partial<Exercise> & { id: string },
) {
  const { data } = await axios.post("/api/admin/update-exercise", input);
  return data as Exercise;
}

export async function adminDeleteExercise(id: string) {
  const { data } = await axios.delete("/api/admin/delete-exercise", {
    params: { id },
  });
  return data as { success: boolean };
}
