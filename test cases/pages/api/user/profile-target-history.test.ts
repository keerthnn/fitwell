import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
  findProfile: vi.fn(),
  createProfile: vi.fn(),
  updateProfile: vi.fn(),
  createTargetHistory: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("fitness/lib/auth/utils", () => ({
  getUserIdOrSetError: mocks.getUserId,
}));
vi.mock("fitness/lib/prisma", () => ({
  default: {
    userProfile: {
      findUnique: mocks.findProfile,
      create: mocks.createProfile,
      update: mocks.updateProfile,
    },
    workoutDayTargetHistory: { create: mocks.createTargetHistory },
    $transaction: mocks.transaction,
  },
}));

import createHandler from "fitness/pages/api/user/create-profile";
import updateHandler from "fitness/pages/api/user/update-profile";

const body = {
  firstName: "Keerthan",
  lastName: "K",
  unitSystem: "METRIC",
  fitnessGoal: "GENERAL_FITNESS",
  experienceLevel: "BEGINNER",
  weeklyWorkoutTarget: 5,
  timezone: "Asia/Kolkata",
};

function responseDouble() {
  let statusCode = 200;
  let responseBody: unknown;
  const response = {
    status: vi.fn((code: number) => {
      statusCode = code;
      return response;
    }),
    send: vi.fn((value: unknown) => {
      responseBody = value;
      return response;
    }),
  };
  return {
    response: response as unknown as NextApiResponse,
    statusCode: () => statusCode,
    body: () => responseBody,
  };
}

describe("PROFILE-002 PROFILE-005 DATA-006 DES-003 target history writes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserId.mockResolvedValue("user_1");
    mocks.findProfile.mockResolvedValue(null);
    mocks.createProfile.mockResolvedValue({ id: "profile_1" });
    mocks.updateProfile.mockResolvedValue({ id: "profile_1" });
    mocks.createTargetHistory.mockResolvedValue({ id: "target_1" });
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        userProfile: {
          findUnique: mocks.findProfile,
          update: mocks.updateProfile,
        },
        workoutDayTargetHistory: { create: mocks.createTargetHistory },
      }),
    );
  });

  it("creates the initial target event inside the profile aggregate", async () => {
    const res = responseDouble();
    await createHandler(
      { method: "POST", body } as NextApiRequest,
      res.response,
    );

    expect(mocks.createProfile).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user_1",
        weeklyWorkoutTarget: 5,
        workoutDayTargetHistory: { create: { daysPerWeek: 5 } },
      }),
    });
    expect(res.statusCode()).toBe(201);
  });

  it("atomically appends an event when the target changes", async () => {
    mocks.findProfile.mockResolvedValue({
      id: "profile_1",
      weeklyWorkoutTarget: 4,
    });
    const res = responseDouble();
    await updateHandler(
      { method: "POST", body } as NextApiRequest,
      res.response,
    );

    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.createTargetHistory).toHaveBeenCalledWith({
      data: { userProfileId: "profile_1", daysPerWeek: 5 },
    });
    expect(res.statusCode()).toBe(200);
  });

  it("does not append an event when the target is unchanged", async () => {
    mocks.findProfile.mockResolvedValue({
      id: "profile_1",
      weeklyWorkoutTarget: 5,
    });
    const res = responseDouble();
    await updateHandler(
      { method: "POST", body } as NextApiRequest,
      res.response,
    );

    expect(mocks.updateProfile).toHaveBeenCalledTimes(1);
    expect(mocks.createTargetHistory).not.toHaveBeenCalled();
  });
});
