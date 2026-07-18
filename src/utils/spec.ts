import axios from "axios";
import {
  AddExercisePayload,
  AdminDashboardStats,
  CreateWorkoutPayload,
  Exercise,
  Profile,
  SaveSetsPayload,
  Workout,
  WorkoutListItem,
  AnalyticsSummary,
  DashboardSummary,
  DailyNutritionSummary,
  Injury,
  MedicalCondition,
  NutritionMutationRequest,
  Paginated,
  WorkoutTemplateDetail,
  WorkoutTemplateSummary,
  AdminTemplate,
} from "./types";

export async function createUser() {
  const { data } = await axios.post("/api/auth/sync-user");
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

export async function deleteAccount() {
  const { data } = await axios.delete("/api/user/delete-account", { params: { confirm: "DELETE" } });
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

export async function getAdminDashboardStats() {
  const { data } = await axios.get("/api/admin/get-dashboard-stats");
  return data as AdminDashboardStats;
}

export async function getAdminStatus() {
  const { data } = await axios.get("/api/admin/get-admin-status");
  return data as { isAdmin: true };
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

export async function adminSetUserAccess(userId: string, isAdmin: boolean) {
  const { data } = await axios.post("/api/admin/set-admin-access", {
    userId,
    isAdmin,
  });
  return data as { success: true; isAdmin: boolean };
}

export async function adminDeleteUser(userId: string) {
  const { data } = await axios.delete("/api/admin/delete-user", {
    params: { userId },
  });
  return data as { success: true };
}

export async function adminGetTemplates(filters?: { search?: string; visibility?: string; archived?: string }) {
  const { data } = await axios.get("/api/admin/templates", { params: filters });
  return data as AdminTemplate[];
}

export async function adminSetTemplateArchived(id: string, isArchived: boolean) {
  const { data } = await axios.patch("/api/admin/templates", { id, isArchived });
  return data as { id: string; isArchived: boolean };
}

export async function adminDeleteTemplate(id: string) {
  const { data } = await axios.delete("/api/admin/templates", { params: { id } });
  return data as { success: true };
}

export async function completeWorkout(id: string, caloriesBurned?: number) {
  const { data } = await axios.post("/api/workouts/complete-workout", { id, caloriesBurned });
  return data;
}

export async function duplicateWorkout(id: string) {
  const { data } = await axios.post("/api/workouts/duplicate-workout", { id });
  return data as { id: string };
}

export async function getDashboardSummary() {
  const { data } = await axios.get("/api/dashboard/summary");
  return data as DashboardSummary;
}

export async function getNutritionDay(start: Date, end: Date) {
  const { data } = await axios.get("/api/nutrition/entries", { params: { start: start.toISOString(), end: end.toISOString() } });
  return data as DailyNutritionSummary;
}

export async function saveNutritionEntry(input: NutritionMutationRequest & { id?: string }) {
  const { data } = await axios.request({ url: "/api/nutrition/entries", method: input.id ? "PATCH" : "POST", data: input });
  return data;
}

export async function deleteNutritionEntry(id: string) {
  await axios.delete("/api/nutrition/entries", { params: { id } });
}

export async function getHealthRecords() {
  const { data } = await axios.get("/api/health/records");
  return data as { conditions: MedicalCondition[]; injuries: Injury[] };
}

export async function saveHealthRecord(input: Record<string, unknown> & { id?: string }) {
  const { data } = await axios.request({ url: "/api/health/records", method: input.id ? "PATCH" : "POST", data: input });
  return data;
}

export async function deleteHealthRecord(id: string, type: "condition" | "injury") {
  await axios.delete("/api/health/records", { params: { id, type } });
}

export async function getTemplates(mode: "mine" | "discover", search = "") {
  const { data } = await axios.get("/api/templates/templates", { params: { mode, search } });
  return data as Paginated<WorkoutTemplateSummary>;
}

export async function getTemplate(id: string) {
  const { data } = await axios.get("/api/templates/get-template", { params: { id } });
  return data as WorkoutTemplateDetail;
}

export async function getSharedTemplate(token: string) {
  const { data } = await axios.get("/api/templates/shared", { params: { token } });
  return data as WorkoutTemplateDetail;
}

export async function saveTemplate(input: Record<string, unknown> & { id?: string }) {
  const { data } = await axios.request({ url: "/api/templates/templates", method: input.id ? "PATCH" : "POST", data: input });
  return data;
}

export async function copyTemplate(id: string, token?: string) {
  const { data } = await axios.post("/api/templates/copy-template", { id, token });
  return data as { id: string };
}

export async function deleteTemplate(id: string) {
  await axios.delete("/api/templates/templates", { params: { id } });
}

export async function getAnalytics(start: Date, end: Date) {
  const { data } = await axios.get("/api/analytics/summary", { params: { start: start.toISOString(), end: end.toISOString() } });
  return data as AnalyticsSummary;
}

export async function saveWeightCheckIn(weightKg: number, recordedAt = new Date(), notes?: string) {
  const { data } = await axios.post("/api/weight/check-ins", { weightKg, recordedAt: recordedAt.toISOString(), notes });
  return data as { id: string };
}

export async function getAchievements() {
  const { data } = await axios.get("/api/achievements/get-achievements");
  return data as Array<{ id: string; key: string; name: string; description: string; icon: string; earned: boolean; awardedAt: string | null }>;
}
