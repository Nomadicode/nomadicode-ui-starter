import { toCamelCaseKeys, toSnakeCaseKeys } from "@/services/api";

describe("api casing boundary", () => {
  it("converts nested response keys to camelCase", () => {
    expect(
      toCamelCaseKeys({ service_name: "api", items: [{ created_at: "x" }] }),
    ).toEqual({ serviceName: "api", items: [{ createdAt: "x" }] });
  });

  it("converts nested request keys to snake_case", () => {
    expect(toSnakeCaseKeys({ firstName: "Ana", tags: [{ isPrimary: true }] })).toEqual({
      first_name: "Ana",
      tags: [{ is_primary: true }],
    });
  });

  it("leaves FormData and dates untouched", () => {
    const form = new FormData();
    const date = new Date(0);

    expect(toSnakeCaseKeys(form)).toBe(form);
    expect(toSnakeCaseKeys({ sentAt: date })).toEqual({ sent_at: date });
  });
});
