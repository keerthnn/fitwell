import type { NextApiRequest, NextApiResponse } from "next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
  findProfile: vi.fn(),
  findWorkouts: vi.fn(),
  activityFind: vi.fn(),
  activityUpsert: vi.fn(),
  workoutUpdate: vi.fn(),
  profileUpdate: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({
  getUserIdOrSetError: mocks.getUserId,
}));
vi.mock("fitness/lib/prisma", () => ({
  default: {
    userProfile: {
      findUnique: mocks.findProfile,
      update: mocks.profileUpdate,
    },
    workout: {
      findMany: mocks.findWorkouts,
      update: mocks.workoutUpdate,
    },
    userActivityDay: {
      findMany: mocks.activityFind,
      upsert: mocks.activityUpsert,
    },
  },
}));

type Handler = (
  request: NextApiRequest,
  response: NextApiResponse,
) => unknown | Promise<unknown>;

const handlerModule = await vi
  .importActual<{ default: Handler }>("fitness/pages/api/user/workout-activity")
  .catch(() => null);

const handler: Handler =
  handlerModule?.default ??
  ((_request, response) =>
    response.status(501).send({ error: "Workout activity is not implemented" }));

function responseDouble() {
  let statusCode = 200;
  let body: unknown;
  const response = {
    status: vi.fn((code: number) => {
      statusCode = code;
      return response;
    }),
    send: vi.fn((value: unknown) => {
      body = value;
      return response;
    }),
    json: vi.fn((value: unknown) => {
      body = value;
      return response;
    }),
    setHeader: vi.fn(() => response),
  };
  return {
    response: response as unknown as NextApiResponse,
    statusCode: () => statusCode,
    body: () => body,
  };
}

describe("PROFILE-011 SEC-001 SEC-002 SEC-004 DES-001 workout activity API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-16T12:00:00.000Z"));
    mocks.getUserId.mockResolvedValue("user_1");
    mocks.findProfile.mockResolvedValue({ timezone: "UTC" });
    mocks.findWorkouts.mockResolvedValue([]);
  });

  afterEach(() => vi.useRealTimers());

  it("DES-001 rejects non-GET methods before authentication or data access", async () => {
    const res = responseDouble();
    await handler(
      { method: "POST", query: {} } as unknown as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(405);
    expect(mocks.getUserId).not.toHaveBeenCalled();
    expect(mocks.findWorkouts).not.toHaveBeenCalled();
  });

  it("SEC-001 does not query workout data when authentication is denied", async () => {
    mocks.getUserId.mockResolvedValue(undefined);
    const res = responseDouble();
    await handler(
      { method: "GET", query: {} } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.getUserId).toHaveBeenCalledTimes(1);
    expect(mocks.findProfile).not.toHaveBeenCalled();
    expect(mocks.findWorkouts).not.toHaveBeenCalled();
  });

  it("SEC-002 SEC-004 binds completed-workout reads to the verified member", async () => {
    mocks.findWorkouts.mockResolvedValue([
      { workoutDate: new Date("2026-09-14T12:00:00.000Z") },
      { workoutDate: new Date("2026-09-14T18:00:00.000Z") },
      { workoutDate: new Date("2026-09-16T12:00:00.000Z") },
    ]);
    const res = responseDouble();
    await handler(
      {
        method: "GET",
        query: {
          userId: "other_user",
          status: "DRAFT",
          timezone: "Pacific/Kiritimati",
          start: "1900-01-01",
        },
      } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.findProfile).toHaveBeenCalledWith({
      where: { userId: "user_1" },
      select: { timezone: true },
    });
    expect(mocks.findWorkouts).toHaveBeenCalledWith({
      where: {
        userId: "user_1",
        status: "COMPLETED",
        workoutDate: { gte: expect.any(Date), lt: expect.any(Date) },
      },
      select: { workoutDate: true },
    });
    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({
      timezone: "UTC",
      startDate: "2025-09-15",
      endDate: "2026-09-20",
      todayDate: "2026-09-16",
      completedDates: ["2026-09-14", "2026-09-16"],
    });
  });

  it.each([
    [null, "UTC"],
    [{ timezone: "Not/A_Timezone" }, "UTC"],
  ])("DES-004 uses %s profile data as %s", async (profile, expectedTimezone) => {
    mocks.findProfile.mockResolvedValue(profile);
    const res = responseDouble();
    await handler(
      { method: "GET", query: {} } as unknown as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(200);
    expect(res.body()).toMatchObject({
      timezone: expectedTimezone,
      completedDates: [],
    });
  });

  it("PROFILE-012 returns a successful empty calendar without workout details", async () => {
    const res = responseDouble();
    await handler(
      { method: "GET", query: {} } as unknown as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(200);
    expect(Object.keys(res.body() as Record<string, unknown>).sort()).toEqual(
      ["completedDates", "endDate", "startDate", "timezone", "todayDate"].sort(),
    );
    expect(res.body()).not.toMatchObject({
      workoutId: expect.anything(),
      count: expect.anything(),
    });
  });

  it("DES-007 never reads app activity or performs a calendar-domain mutation", async () => {
    const res = responseDouble();
    await handler(
      { method: "GET", query: {} } as unknown as NextApiRequest,
      res.response,
    );

    expect(mocks.getUserId).toHaveBeenCalledTimes(1);
    expect(mocks.findProfile).toHaveBeenCalledTimes(1);
    expect(mocks.findWorkouts).toHaveBeenCalledTimes(1);
    expect(mocks.activityFind).not.toHaveBeenCalled();
    expect(mocks.activityUpsert).not.toHaveBeenCalled();
    expect(mocks.workoutUpdate).not.toHaveBeenCalled();
    expect(mocks.profileUpdate).not.toHaveBeenCalled();
  });

  it("PROFILE-012 DES-008 reports unexpected failures without false emptiness or details", async () => {
    mocks.findWorkouts.mockRejectedValue(new Error("database-secret-detail"));
    const res = responseDouble();
    await handler(
      { method: "GET", query: {} } as unknown as NextApiRequest,
      res.response,
    );

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ error: "Workout activity could not be loaded" });
    expect(JSON.stringify(res.body())).not.toContain("database-secret-detail");
    expect(res.body()).not.toMatchObject({ completedDates: [] });
  });
});
