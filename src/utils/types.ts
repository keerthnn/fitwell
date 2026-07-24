export interface Profile {
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
  activityLevel?: "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE";
  dailyCalorieTarget?: number;
  targetWeightKg?: number | null;
  preferredUnits?: "METRIC" | "IMPERIAL";
  timezone?: string;
  weeklyWorkoutTarget?: number;
  preferredWorkoutDays?: number[];
}

export type ApiError = { error: string; fieldErrors?: Record<string, string[]> };
export type Paginated<T> = { items: T[]; nextCursor: string | null };

export interface CreateWorkoutPayload {
  title?: string;
  date: Date;
  durationM?: number;
  notes?: string;
  templateId?: string;
  intensity?: "LIGHT" | "MODERATE" | "VIGOROUS";
}

export interface Workout {
  id: string;
  userId: string;
  title: string | null;
  date: string;
  durationM: number | null;
  notes: string | null;
  exercises: WorkoutExerciseDetail[];
  createdAt: string;
  updatedAt: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  intensity: "LIGHT" | "MODERATE" | "VIGOROUS";
  caloriesBurned: number | null;
  estimatedCaloriesBurned: number | null;
  perceivedDifficulty: number | null;
}

export interface WorkoutExerciseDetail {
  id: string;
  workoutId: string;
  exerciseId: string;
  order: number;
  notes: string | null;
  exercise: {
    id: string;
    name: string;
    equipment: string;
    movement: string;
    category: string;
    region: string | null;
  };
  sets: WorkoutSet[];
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  durationS: number | null;
  distanceM: number | null;
  rpe: number | null;
}

export interface WorkoutListItem {
  id: string;
  title: string | null;
  date: string;
  durationM: number | null;
  exerciseCount: number;
  status?: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  caloriesBurned?: number | null;
}

export interface Exercise {
  id: string;
  name: string;
  equipment: string;
  movement: string;
  category: string;
  region: string | null;
  isCompound: boolean;
  contraindicationTags?: string[];
  safetyNotes?: string | null;
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
export interface AdminAnalyticsMetadata {
  range: AdminAnalyticsRange;
  grouping: Exclude<AdminAnalyticsGrouping, "AUTO">;
  start: string;
  end: string;
  timezone: string;
}
export interface AnalyticsPoint {
  bucket: string;
  label: string;
  [key: string]: string | number;
}
export interface DistributionPoint { name: string; value: number }
export interface RankedAnalyticsItem { name: string; value: number }
export interface AdminSummaryAnalytics {
  metadata: AdminAnalyticsMetadata;
  users: { total: number; active: number; inactive: number; newInPeriod: number };
  workouts: { total: number; completed: number; incomplete: number; createdInPeriod: number };
  templates: { total: number; public: number; private: number; unlisted: number; archived: number; createdInPeriod: number };
  nutrition: { total: number; entriesInPeriod: number; participatingUsers: number };
  health: { totalInjuries: number; active: number; recovered: number; addedInPeriod: number };
  weight: { total: number; entriesInPeriod: number; participatingUsers: number };
  achievements: { totalAwarded: number; awardedInPeriod: number; uniqueUsers: number };
  totalExercises: number;
}
export interface AdminUsersAnalytics {
  metadata: AdminAnalyticsMetadata;
  totals: AdminSummaryAnalytics["users"];
  series: AnalyticsPoint[];
  historyApproximateBefore: string;
}
export interface AdminWorkoutsAnalytics {
  metadata: AdminAnalyticsMetadata;
  totals: AdminSummaryAnalytics["workouts"] & { averagePerActiveUser: number; durationM: number; caloriesBurned: number };
  series: AnalyticsPoint[];
  statusDistribution: DistributionPoint[];
  weekdayFrequency: DistributionPoint[];
}
export interface AdminTemplatesAnalytics {
  metadata: AdminAnalyticsMetadata;
  totals: AdminSummaryAnalytics["templates"] & { active: number; usesInPeriod: number; copiesInPeriod: number };
  series: AnalyticsPoint[];
  visibilityDistribution: DistributionPoint[];
  mostUsed: RankedAnalyticsItem[];
  mostCopied: RankedAnalyticsItem[];
}
export interface AdminNutritionAnalytics {
  metadata: AdminAnalyticsMetadata;
  totals: AdminSummaryAnalytics["nutrition"] & { averagePerParticipant: number };
  series: AnalyticsPoint[];
}
export interface AdminHealthAnalytics {
  metadata: AdminAnalyticsMetadata;
  totals: AdminSummaryAnalytics["health"] & { usersWithActiveInjuries: number };
  series: AnalyticsPoint[];
}
export interface AdminWeightAnalytics {
  metadata: AdminAnalyticsMetadata;
  totals: AdminSummaryAnalytics["weight"] & { averagePerParticipant: number };
  series: AnalyticsPoint[];
}
export interface AdminAchievementsAnalytics {
  metadata: AdminAnalyticsMetadata;
  totals: AdminSummaryAnalytics["achievements"];
  series: AnalyticsPoint[];
  mostEarned: RankedAnalyticsItem[];
  leastEarned: RankedAnalyticsItem[];
}

export interface PersonalAnalyticsDashboard {
  metadata: AdminAnalyticsMetadata;
  workouts: {
    total: number; completed: number; incomplete: number; createdInPeriod: number;
    durationM: number; caloriesBurned: number; series: AnalyticsPoint[];
    statusDistribution: DistributionPoint[]; weekdayFrequency: DistributionPoint[];
  };
  templates: {
    total: number; public: number; private: number; unlisted: number; archived: number;
    active: number; createdInPeriod: number; usesInPeriod: number; copiesInPeriod: number;
    series: AnalyticsPoint[]; visibilityDistribution: DistributionPoint[];
    mostUsed: RankedAnalyticsItem[]; mostCopied: RankedAnalyticsItem[];
  };
  nutrition: { total: number; entriesInPeriod: number; series: AnalyticsPoint[] };
  health: { totalInjuries: number; active: number; recovered: number; addedInPeriod: number; series: AnalyticsPoint[] };
  weight: { total: number; entriesInPeriod: number; series: AnalyticsPoint[] };
  achievements: { totalAwarded: number; awardedInPeriod: number; series: AnalyticsPoint[]; mostEarned: RankedAnalyticsItem[]; leastEarned: RankedAnalyticsItem[] };
}

export interface AdminTemplate {
  id: string;
  title: string;
  description: string | null;
  visibility: "PRIVATE" | "UNLISTED" | "PUBLIC";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isArchived: boolean;
  copyCount: number;
  useCount: number;
  exerciseCount: number;
  workoutCount: number;
  catalogSlug: string | null;
  owner: { id: string; name: string | null; email: string; avatarUrl: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface AddExercisePayload {
  exerciseId: string;
  order: number;
}

export interface SaveSetsPayload {
  sets: Array<{
    setNumber: number;
    reps?: number;
    weightKg?: number;
    durationS?: number;
    distanceM?: number;
    rpe?: number;
    isCompleted?: boolean;
    restDurationS?: number;
  }>;
}

export interface NutritionEntry {
  id: string;
  consumedAt: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "PRE_WORKOUT" | "POST_WORKOUT" | "OTHER";
  foodName: string;
  calories: number;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  fibreG: number | null;
  servingQuantity: number | null;
  servingUnit: string | null;
  notes: string | null;
}

export type NutritionMutationRequest = Omit<NutritionEntry, "id" | "proteinG" | "carbsG" | "fatG" | "fibreG" | "servingQuantity" | "servingUnit" | "notes"> & Partial<Pick<NutritionEntry, "proteinG" | "carbsG" | "fatG" | "fibreG" | "servingQuantity" | "servingUnit" | "notes">>;

export interface DailyNutritionSummary {
  entries: NutritionEntry[];
  consumed: number;
  burned: number;
  net: number;
  remaining: number;
  target: number;
  macros: { proteinG: number; carbsG: number; fatG: number; fibreG: number };
}

export interface MedicalCondition {
  id: string; name: string; status: "ACTIVE" | "MANAGED" | "RESOLVED";
  severity: string | null; startedAt: string | null; resolvedAt: string | null;
  clinicianGuidance: string | null; notes: string | null;
}

export interface Injury {
  id: string; bodyRegion: string; name: string;
  side: "LEFT" | "RIGHT" | "BILATERAL" | "NOT_APPLICABLE";
  status: "ACTIVE" | "RECOVERING" | "RESOLVED"; painLevel: number | null;
  startedAt: string | null; resolvedAt: string | null; notes: string | null;
  exercisesToAvoid: string[]; contraindicationTags: string[];
}

export interface TemplateExerciseTarget {
  exerciseId: string; order: number; targetSets: number; minReps?: number | null;
  maxReps?: number | null; suggestedWeightKg?: number | null; targetRpe?: number | null;
  restSeconds?: number | null; notes?: string | null;
  exercise?: Pick<Exercise, "id" | "name" | "equipment" | "category">;
}

export interface WorkoutTemplateSummary {
  id: string; title: string; description: string | null; goal: string | null;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  visibility: "PRIVATE" | "UNLISTED" | "PUBLIC"; estimatedDurationM: number | null;
  tags: string[]; copyCount: number; useCount: number; exerciseCount: number;
  owner: { name: string | null; avatarUrl: string | null }; shareToken?: string | null;
}

export interface WorkoutTemplateDetail extends WorkoutTemplateSummary { exercises: TemplateExerciseTarget[] }

export interface DashboardSummary {
  streak: { current: number; best: number };
  calories: { consumed: number; burned: number; net: number; remaining: number; target: number };
  workouts: { thisWeek: number; thisMonth: number; total: number; weeklyTarget: number };
  recentWorkouts: WorkoutListItem[];
  activity: Array<{ date: string; count: number }>;
  latestAchievements: EarnedAchievement[];
  activeHealthCount: number;
}

export interface EarnedAchievement {
  key: string; name: string; description: string; icon: string; awardedAt: string;
}

export interface AnalyticsSummary {
  totals: { workouts: number; durationM: number; sets: number; volumeKg: number; caloriesBurned: number; caloriesConsumed: number; netCalories: number };
  muscleDistribution: Array<{ name: string; value: number }>;
  weekdayFrequency: Array<{ name: string; value: number }>;
  weightTrend: Array<{ date: string; weightKg: number }>;
}
