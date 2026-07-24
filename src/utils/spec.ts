import axios from "axios";
import type {
  AdminAccessListItem,
  AdminAuditLogListItem,
  AdminUserDetail,
  AdminUserListItem,
  AdminWorkoutListItem,
  AnalyticsSummary,
  CreateWorkoutRequest,
  DashboardSummary,
  Exercise,
  Paginated,
  Profile,
  Workout,
  WorkoutListItem,
  WorkoutPlan,
  WorkoutSet,
} from "./types";

export const createUser = async () =>
  (await axios.post("/api/auth/sync-user")).data as { userName: string };
export const getProfileStatus = async () =>
  (await axios.get("/api/user/get-profile-status")).data as {
    hasProfile: boolean;
    onboardingCompleted: boolean;
  };
export const getUserProfile = async () =>
  (await axios.get("/api/user/get-user-profile")).data as Profile | null;
export const createProfile = async (input: Profile) =>
  (await axios.post("/api/user/create-profile", input)).data as { success: true };
export const updateProfile = async (input: Profile) =>
  (await axios.post("/api/user/update-profile", input)).data as { success: true };
export const deleteProfile = async () =>
  (await axios.delete("/api/user/delete-profile")).data as { success: true };
export const deleteAccount = async () =>
  (await axios.delete("/api/user/delete-account", { params: { confirm: "DELETE" } })).data as {
    success: true;
  };

export const createWorkout = async (input: CreateWorkoutRequest) =>
  (await axios.post("/api/workouts/create-workout", input)).data as { id: string };
export const getWorkouts = async (params?: Record<string, string>) =>
  (await axios.get("/api/workouts/get-workouts", { params })).data as Paginated<WorkoutListItem>;
export const getWorkoutById = async (id: string) =>
  (await axios.get("/api/workouts/get-workout-by-id", { params: { id } })).data as Workout;
export const updateWorkout = async (input: Partial<CreateWorkoutRequest> & { id: string }) =>
  (await axios.patch("/api/workouts/update-workout", input)).data as Workout;
export const duplicateWorkout = async (id: string) =>
  (await axios.post("/api/workouts/duplicate-workout", { id })).data as { id: string };
export const completeWorkout = async (id: string) =>
  (await axios.post("/api/workouts/complete-workout", { id })).data as Workout;
export const pauseWorkout = async (id: string) =>
  (await axios.post("/api/workouts/pause-workout", { id })).data as Workout;
export const resumeWorkout = async (id: string) =>
  (await axios.post("/api/workouts/resume-workout", { id })).data as Workout;
export const deleteWorkout = async (id: string) =>
  (await axios.delete("/api/workouts/delete-workout", { params: { id } })).data as {
    success: true;
  };

export const getExercises = async (params?: Record<string, string>) =>
  (await axios.get("/api/exercises/get-exercises", { params })).data as Paginated<Exercise>;
export const getExerciseById = async (id: string, includeInactive = false) =>
  (await axios.get("/api/exercises/get-exercise-by-id", { params: { id, includeInactive } })).data as Exercise;
export const addExerciseToWorkout = async (
  workoutId: string,
  input: { exerciseId: string; order: number },
) => (await axios.post("/api/workout-exercises/add-exercise", { workoutId, ...input })).data;
export const saveWorkoutExerciseSets = async (
  workoutExerciseId: string,
  sets: WorkoutSet[],
) => (await axios.post("/api/workout-exercises/save-sets", { workoutExerciseId, sets })).data;
export const deleteWorkoutExercise = async (id: string) =>
  (await axios.delete("/api/workout-exercises/delete-exercise", { params: { id } })).data;

export const listWorkoutPlans = async (params?: Record<string, string>) =>
  (await axios.get("/api/workout-plans/list", { params })).data as Paginated<WorkoutPlan>;
export const getWorkoutPlan = async (id: string, includeArchived = false) =>
  (await axios.get("/api/workout-plans/get-by-id", { params: { id, includeArchived } })).data as WorkoutPlan;
export const createWorkoutPlan = async (input: Partial<WorkoutPlan>) =>
  (await axios.post("/api/workout-plans/create", input)).data as WorkoutPlan;
export const updateWorkoutPlan = async (input: Partial<WorkoutPlan> & { id: string }) =>
  (await axios.patch("/api/workout-plans/update", input)).data as WorkoutPlan;
export const archiveWorkoutPlan = async (id: string, archived: boolean) =>
  (await axios.post("/api/workout-plans/archive", { id, archived })).data as WorkoutPlan;
export const duplicateWorkoutPlan = async (id: string) =>
  (await axios.post("/api/workout-plans/duplicate", { id })).data as WorkoutPlan;
export const startWorkoutFromPlan = async (id: string) =>
  (await axios.post("/api/workout-plans/start-workout", { id })).data as { id: string };

export const getDashboardSummary = async () =>
  (await axios.get("/api/dashboard/summary")).data as DashboardSummary;
export const getAnalytics = async (params?: Record<string, string>) =>
  (await axios.get("/api/analytics/summary", { params })).data as AnalyticsSummary;
export const getAdminStatus = async () =>
  (await axios.get("/api/admin/get-admin-status")).data as { isAdmin: true };
export const getAdminSummary = async () =>
  (await axios.get("/api/admin/dashboard/summary")).data as Record<string, number>;
export const getAdminUsers = async () =>
  (await axios.get<Paginated<AdminUserListItem>>("/api/admin/users/list")).data;
export const getAdminUser = async (id: string) =>
  (
    await axios.get<AdminUserDetail>("/api/admin/users/get-by-id", {
      params: { id },
    })
  ).data;
export const getAdminWorkouts = async () =>
  (
    await axios.get<Paginated<AdminWorkoutListItem>>(
      "/api/admin/workouts/list",
    )
  ).data;
export const getAdminAnalytics = async () =>
  (await axios.get("/api/admin/analytics/summary")).data as Record<string, number>;
export const getAdminAccessList = async () =>
  (
    await axios.get<{ items: AdminAccessListItem[] }>(
      "/api/admin/admin-access/list",
    )
  ).data;
export const getAdminAuditLogs = async () =>
  (
    await axios.get<{ items: AdminAuditLogListItem[] }>(
      "/api/admin/audit-logs/list",
    )
  ).data;
export const adminDisableUser = async (id: string) =>
  (await axios.post("/api/admin/users/disable", { id })).data as { success: true };
export const adminRestoreUser = async (id: string) =>
  (await axios.post("/api/admin/users/restore", { id })).data as { success: true };
export const adminDeleteUser = async (id: string) =>
  (await axios.delete("/api/admin/users/delete", { params: { id } })).data as { success: true };
export const adminCreateExercise = async (input: Partial<Exercise>) =>
  (await axios.post("/api/admin/exercises/create", input)).data as Exercise;
export const adminUpdateExercise = async (input: Partial<Exercise> & { id: string }) =>
  (await axios.patch("/api/admin/exercises/update", input)).data as Exercise;
export const adminArchiveExercise = async (id: string) =>
  (await axios.post("/api/admin/exercises/archive", { id })).data as { success: true };
export const adminRestoreExercise = async (id: string) =>
  (await axios.post("/api/admin/exercises/restore", { id })).data as { success: true };
export const adminCreateWorkoutPlan = async (input: Partial<WorkoutPlan>) =>
  (await axios.post("/api/admin/workout-plans/create", input)).data as WorkoutPlan;
export const adminUpdateWorkoutPlan = async (input: Partial<WorkoutPlan> & { id: string }) =>
  (await axios.patch("/api/admin/workout-plans/update", input)).data as WorkoutPlan;
export const adminArchiveWorkoutPlan = async (id: string) =>
  (await axios.post("/api/admin/workout-plans/archive", { id })).data as { success: true };
export const adminRestoreWorkoutPlan = async (id: string) =>
  (await axios.post("/api/admin/workout-plans/restore", { id })).data as { success: true };
export const adminDeleteWorkout = async (id: string) =>
  (await axios.delete("/api/admin/workouts/delete", { params: { id } })).data as { success: true };
export const adminGrantAccess = async (id: string) =>
  (await axios.post("/api/admin/admin-access/grant", { id })).data as { success: true };
export const adminRemoveAccess = async (id: string) =>
  (await axios.post("/api/admin/admin-access/remove", { id })).data as { success: true };
