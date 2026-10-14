import type { withEvent as WithEvent } from "@/services/analytics";

const mockCapture = jest.fn();
const mockRegister = jest.fn();

jest.mock("posthog-react-native", () =>
  jest.fn().mockImplementation(() => ({
    capture: mockCapture,
    register: mockRegister,
  })),
);

function loadAnalytics(token: string | undefined) {
  let loaded: typeof import("@/services/analytics") | undefined;
  jest.isolateModules(() => {
    if (token === undefined) delete process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
    else process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN = token;
    // isolateModules is synchronous, so the fresh module has to be required.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    loaded = require("@/services/analytics");
  });
  delete process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
  return loaded!;
}

describe("analytics", () => {
  beforeEach(() => {
    mockCapture.mockClear();
    mockRegister.mockClear();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it("stays disabled without a project token", () => {
    expect(loadAnalytics(undefined).analytics).toBeNull();
  });

  it("tags every event with the product and app", () => {
    loadAnalytics("phc_test");

    expect(mockRegister).toHaveBeenCalledWith({
      product: "starter",
      app: "starter-app",
    });
  });

  describe("withEvent", () => {
    let withEvent: typeof WithEvent;

    beforeEach(() => {
      withEvent = loadAnalytics("phc_test").withEvent;
    });

    it("captures the event with input-derived properties after success", async () => {
      const save = withEvent(
        "note_saved",
        async (input: { id: string }) => ({ saved: input.id }),
        (input) => ({ note_id: input.id }),
      );

      await expect(save({ id: "n1" })).resolves.toEqual({ saved: "n1" });
      expect(mockCapture).toHaveBeenCalledWith("note_saved", { note_id: "n1" });
    });

    it("captures nothing when the mutation fails", async () => {
      const save = withEvent("note_saved", async () => {
        throw new Error("offline");
      });

      await expect(save(undefined)).rejects.toThrow("offline");
      expect(mockCapture).not.toHaveBeenCalled();
    });
  });
});
