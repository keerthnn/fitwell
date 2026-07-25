import type { Prisma } from "fitness/generated/prisma/client";

export const auditData = (
  adminId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Prisma.InputJsonValue,
) => ({
  adminId,
  action,
  entityType,
  entityId,
  ...(metadata ? { metadata } : {}),
});
