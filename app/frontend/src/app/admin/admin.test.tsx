// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminLayout from "./layout";

const redirectMock = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    redirectMock(url);
    throw new Error(`Redirected to ${url}`);
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));

// Mock checkIsAdmin for testing
vi.mock("@/lib/admin-auth", () => ({
  checkIsAdmin: vi.fn(),
}));

import { checkIsAdmin } from "@/lib/admin-auth";

describe("AdminLayout (Authentication & Redirection)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    window.sessionStorage.clear();
    document.cookie = "";
    redirectMock.mockClear();
    (checkIsAdmin as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("redirects unauthenticated / non-admin users away from /admin/* routes in preview runtime config", async () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    delete process.env.NEXT_PUBLIC_ADMIN_API_KEY;
    (checkIsAdmin as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    await expect(
      render(
        <AdminLayout>
          <div>Admin Content</div>
        </AdminLayout>,
      )
    ).rejects.toThrow("Redirected to /");

    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("redirects unauthenticated / non-admin users away from /admin/* routes in production runtime config", async () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    delete process.env.NEXT_PUBLIC_ADMIN_API_KEY;
    (checkIsAdmin as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    await expect(
      render(
        <AdminLayout>
          <div>Admin Content</div>
        </AdminLayout>,
      )
    ).rejects.toThrow("Redirected to /");

    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("renders admin console when valid admin session/credential is present", async () => {
    (checkIsAdmin as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    render(
      <AdminLayout>
        <div>Admin Console Body</div>
      </AdminLayout>,
    );

    expect(screen.getByText("Admin Console Body")).toBeDefined();
    expect(screen.getByText("Admin Console")).toBeDefined();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
