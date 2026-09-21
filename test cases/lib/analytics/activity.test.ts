import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  countUsers: vi.fn(),
}));

vi.mock("fitness/lib/prisma", () => ({
  default: {
    user: { count: mocks.countUsers },
  },
}));

import { countDailyActiveUsers } from "fitness/lib/analytics/activity";

describe("ADMIN-010 daily active users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.countUsers.mockResolvedValue(3);
  });

  it("counts enabled, non-deleted users with authenticated activity since UTC midnight", async () => {
    const now = new Date("2026-09-21T18:45:00.000Z");

    await expect(countDailyActiveUsers(now)).resolves.toBe(3);
    expect(mocks.countUsers).toHaveBeenCalledWith({
      where: {
        isDisabled: false,
        deletedAt: null,
        activityDays: {
          some: {
            lastActiveAt: { gte: new Date("2026-09-21T00:00:00.000Z") },
          },
        },
      },
    });
  });
});
