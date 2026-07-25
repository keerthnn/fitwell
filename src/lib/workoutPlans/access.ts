import prisma from "fitness/lib/prisma";

export const workoutPlanInclude = {
  exercises: {
    orderBy: { order: "asc" as const },
    include: { exercise: true },
  },
};

export function findVisibleWorkoutPlan(id: string, userId: string) {
  return prisma.workoutPlan.findFirst({
    where: {
      id,
      isActive: true,
      OR: [
        { userId, isBuiltIn: false },
        { userId: null, isBuiltIn: true, isArchived: false },
      ],
    },
    include: workoutPlanInclude,
  });
}
