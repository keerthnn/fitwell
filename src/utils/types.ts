export type UnitSystem = "METRIC" | "IMPERIAL";
export type FitnessGoal =
  | "LOSE_FAT"
  | "BUILD_MUSCLE"
  | "IMPROVE_STRENGTH"
  | "IMPROVE_ENDURANCE"
  | "MAINTAIN_FITNESS"
  | "GENERAL_FITNESS";
export type ExperienceLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type WorkoutStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";
export type WorkoutEntryMode = "LIVE" | "QUICK_ENTRY" | "PLAN";
export type TrackingType =
  | "REPS_WEIGHT"
  | "REPS_ONLY"
  | "DURATION"
  | "DISTANCE"
  | "DURATION_DISTANCE";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  error: string;
  details?: ValidationError[];
}

export interface Profile {
  firstName: string;
  lastName: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  heightCm?: number | null;
  currentWeightKg?: number | null;
  unitSystem: UnitSystem;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  weeklyWorkoutTarget: number;
  typicalWorkoutDuration?: number | null;
  preferredWorkoutTime?: string | null;
  timezone: string;
  onboardingCompleted: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  equipment: string;
  movement: string;
  category: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  isCompound: boolean;
  trackingType: TrackingType;
  isActive: boolean;
  imagePath: string | null;
  thumbnailPath: string | null;
  equipmentImagePath: string | null;
}

export interface WorkoutSet {
  id?: string;
  setNumber: number;
  reps?: number | null;
  weightKg?: number | null;
  durationSeconds?: number | null;
  distanceMeters?: number | null;
  restSeconds?: number | null;
  isCompleted: boolean;
}

export interface WorkoutExerciseDetail {
  id: string;
  workoutId: string;
  exerciseId: string;
  order: number;
  notes: string | null;
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  workoutDate: string;
  status: WorkoutStatus;
  entryMode: WorkoutEntryMode;
  startedAt: string | null;
  completedAt: string | null;
  durationMinutes: number | null;
  notes: string | null;
  sourceWorkoutPlanId: string | null;
  exercises: WorkoutExerciseDetail[];
}

export type ExerciseImageMetadata = Pick<
  Exercise,
  | "name"
  | "imagePath"
  | "equipmentImagePath"
  | "equipment"
  | "primaryMuscle"
  | "category"
  | "movement"
>;

export interface WorkoutListItem {
  id: string;
  name: string;
  workoutDate: string;
  status: WorkoutStatus;
  entryMode: WorkoutEntryMode;
  durationMinutes: number | null;
  exerciseCount: number;
  representativeExercise: ExerciseImageMetadata | null;
  sourcePlanCoverImagePath: string | null;
  sourcePlanCategory: string | null;
}

export interface WorkoutPlanExercise {
  id?: string;
  exerciseId: string;
  order: number;
  sets: number;
  minimumReps?: number | null;
  maximumReps?: number | null;
  weightGuidance?: string | null;
  restSeconds?: number | null;
  notes?: string | null;
  exercise?: Exercise;
}

export interface WorkoutPlan {
  id: string;
  userId: string | null;
  name: string;
  description: string | null;
  difficulty: ExperienceLevel;
  category: string;
  daysPerWeek: number;
  isBuiltIn: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isArchived: boolean;
  coverImagePath: string | null;
  exercises: WorkoutPlanExercise[];
}

export interface CreateWorkoutRequest {
  name: string;
  workoutDate: string;
  entryMode: WorkoutEntryMode;
  durationMinutes?: number;
  notes?: string;
}

export interface DashboardSummary {
  greetingName: string;
  workoutsThisWeek: number;
  weeklyTarget: number;
  currentStreak: number;
  completedWorkouts: number;
  totalDurationMinutes: number;
  recentWorkouts: WorkoutListItem[];
  activeWorkout: WorkoutListItem | null;
  savedPlans: Array<Pick<WorkoutPlan, "id" | "name" | "coverImagePath">>;
  frequentExercises: Array<{
    exercise: ExerciseImageMetadata;
    count: number;
  }>;
}

export interface AnalyticsSummary {
  completedWorkouts: number;
  durationMinutes: number;
  totalVolumeKg: number;
  exercisesPerformed: number;
  currentStreak: number;
  muscleDistribution: Array<{ name: string; value: number }>;
  workoutFrequency: Array<{ name: string; value: number }>;
  personalBests: Array<{ exercise: string; weightKg: number }>;
  workoutPlanUsage: Array<{ name: string; value: number }>;
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}

export type AdminAnalyticsRange =
  | "TODAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "THIS_MONTH"
  | "THIS_YEAR"
  | "CUSTOM"
  | "ALL_TIME";
export type AdminAnalyticsGrouping = "AUTO" | "DAY" | "WEEK" | "MONTH" | "YEAR";
export interface AdminAnalyticsQuery {
  range: AdminAnalyticsRange;
  start?: string;
  end?: string;
  groupBy?: AdminAnalyticsGrouping;
}
