const plan = (slug, name, exercises) => ({
  slug,
  name,
  description: `${name} is a balanced FitWell workout programme.`,
  difficulty: "INTERMEDIATE",
  category: name,
  daysPerWeek: 1,
  exercises,
});

export const workoutPlans = [
  plan("push-day", "Push Day", ["Barbell Bench Press", "Incline Dumbbell Press", "Barbell Overhead Press", "Dumbbell Lateral Raise", "Tricep Pushdown", "Overhead Dumbbell Extension"]),
  plan("pull-day", "Pull Day", ["Pull-Up", "Barbell Row", "Lat Pulldown", "Seated Cable Row", "Face Pull", "Dumbbell Bicep Curl"]),
  plan("leg-day", "Leg Day", ["Barbell Back Squat", "Romanian Deadlift", "Leg Press", "Walking Lunge", "Lying Leg Curl", "Standing Machine Calf Raise"]),
  plan("upper-body", "Upper Body", ["Barbell Bench Press", "Barbell Row", "Incline Dumbbell Press", "Lat Pulldown", "Dumbbell Lateral Raise", "Dumbbell Bicep Curl", "Tricep Pushdown"]),
  plan("lower-body", "Lower Body", ["Barbell Back Squat", "Romanian Deadlift", "Dumbbell Bulgarian Split Squat", "Barbell Hip Thrust", "Lying Leg Curl", "Standing Machine Calf Raise"]),
  plan("chest", "Chest", ["Barbell Bench Press", "Incline Dumbbell Press", "Pec Deck Fly", "Cable Fly", "Push-Up"]),
  plan("back", "Back", ["Pull-Up", "Barbell Row", "Lat Pulldown", "Seated Cable Row", "Straight-Arm Cable Pulldown", "Face Pull"]),
  plan("shoulders", "Shoulders", ["Barbell Overhead Press", "Arnold Press", "Dumbbell Lateral Raise", "Dumbbell Rear Delt Fly", "Face Pull"]),
  plan("biceps", "Biceps", ["Barbell Curl", "Dumbbell Bicep Curl", "Hammer Curl", "Dumbbell Preacher Curl", "Concentration Curl"]),
  plan("triceps", "Triceps", ["Close-Grip Bench Press", "Barbell Skull Crusher", "Tricep Pushdown", "Overhead Dumbbell Extension", "Bench Dip"]),
  plan("arms", "Arms", ["Barbell Curl", "Close-Grip Bench Press", "Hammer Curl", "Tricep Pushdown", "Dumbbell Preacher Curl", "Overhead Dumbbell Extension"]),
  plan("abs", "Abs", ["Plank", "Hanging Leg Raise", "Cable Crunch", "Russian Twist", "Bicycle Crunch", "Mountain Climber"]),
  plan("full-body", "Full Body", ["Barbell Back Squat", "Barbell Bench Press", "Barbell Row", "Romanian Deadlift", "Barbell Overhead Press", "Pull-Up", "Suitcase Carry"]),
];
