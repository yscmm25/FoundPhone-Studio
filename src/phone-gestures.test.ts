import { describe, expect, it } from "vitest";
import { movedBeyondThreshold } from "./phone-gestures";

describe("movedBeyondThreshold", () => {
  it("keeps a stationary press eligible for long press", () => {
    expect(movedBeyondThreshold(100, 100, 103, 104)).toBe(false);
  });

  it("detects horizontal and vertical movement", () => {
    expect(movedBeyondThreshold(100, 100, 106, 100)).toBe(true);
    expect(movedBeyondThreshold(100, 100, 100, 106)).toBe(true);
  });

  it("compares movement in phone points when the device is scaled", () => {
    expect(movedBeyondThreshold(100, 100, 108, 100, 2)).toBe(false);
    expect(movedBeyondThreshold(100, 100, 111, 100, 2)).toBe(true);
  });

  it("uses a safe scale when the supplied scale is invalid", () => {
    expect(movedBeyondThreshold(100, 100, 106, 100, 0)).toBe(true);
  });
});
