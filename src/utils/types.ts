export interface Profile {
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
}

export interface CreateWorkoutPayload {
  title?: string;
  date: Date;
  durationM?: number;
  notes?: string;
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
}

export interface Exercise {
  id: string;
  name: string;
  equipment: string;
  movement: string;
  category: string;
  region: string | null;
  isCompound: boolean;
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
  }>;
}
