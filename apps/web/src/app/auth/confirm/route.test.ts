import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Hoist mocks
const { mockCreateClient, mockRedirect } = vi.hoisted(() => ({
  mockCreateClient: vi.fn(),
  mockRedirect: vi.fn(),
}));

// Mock Supabase server client
vi.mock("@/server/utils/supabase-server", () => ({
  createClient: mockCreateClient,
}));

// Mock Next.js redirect
vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

describe("GET /auth/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset redirect mock to throw so we can catch it in tests
    mockRedirect.mockImplementation((url: string) => {
      throw new Error(`Redirect to: ${url}`);
    });
  });

  describe("successful OTP verification", () => {
    beforeEach(() => {
      mockCreateClient.mockResolvedValue({
        auth: {
          verifyOtp: vi.fn().mockResolvedValue({ error: null }),
        },
      });
    });

    it("redirects to custom next URL on successful verification", async () => {
      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=abc123&type=email&next=/dashboard",
      );

      await expect(GET(request)).rejects.toThrow("Redirect to: /dashboard");
      expect(mockCreateClient).toHaveBeenCalledOnce();
      expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
    });

    it("redirects to root URL when next param is not provided", async () => {
      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=abc123&type=email",
      );

      await expect(GET(request)).rejects.toThrow("Redirect to: /");
      expect(mockCreateClient).toHaveBeenCalledOnce();
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("calls verifyOtp with correct parameters", async () => {
      const mockVerifyOtp = vi.fn().mockResolvedValue({ error: null });
      mockCreateClient.mockResolvedValue({
        auth: {
          verifyOtp: mockVerifyOtp,
        },
      });

      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=test_token&type=signup&next=/welcome",
      );

      await expect(GET(request)).rejects.toThrow("Redirect to: /welcome");
      expect(mockVerifyOtp).toHaveBeenCalledWith({
        type: "signup",
        token_hash: "test_token",
      });
    });
  });

  describe("OTP verification failure", () => {
    beforeEach(() => {
      mockCreateClient.mockResolvedValue({
        auth: {
          verifyOtp: vi.fn().mockResolvedValue({
            error: { message: "Invalid token" },
          }),
        },
      });
    });

    it("redirects to error page when verification fails", async () => {
      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=invalid_token&type=email&next=/dashboard",
      );

      await expect(GET(request)).rejects.toThrow("Redirect to: /error");
      expect(mockCreateClient).toHaveBeenCalledOnce();
      expect(mockRedirect).toHaveBeenCalledWith("/error");
    });
  });

  describe("missing required parameters", () => {
    it("redirects to error page when token_hash is missing", async () => {
      const request = new NextRequest(
        "https://example.com/auth/confirm?type=email&next=/dashboard",
      );

      await expect(GET(request)).rejects.toThrow("Redirect to: /error");
      expect(mockCreateClient).not.toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/error");
    });

    it("redirects to error page when type is missing", async () => {
      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=abc123&next=/dashboard",
      );

      await expect(GET(request)).rejects.toThrow("Redirect to: /error");
      expect(mockCreateClient).not.toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/error");
    });

    it("redirects to error page when both token_hash and type are missing", async () => {
      const request = new NextRequest(
        "https://example.com/auth/confirm?next=/dashboard",
      );

      await expect(GET(request)).rejects.toThrow("Redirect to: /error");
      expect(mockCreateClient).not.toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/error");
    });

    it("redirects to error page when no query parameters provided", async () => {
      const request = new NextRequest("https://example.com/auth/confirm");

      await expect(GET(request)).rejects.toThrow("Redirect to: /error");
      expect(mockCreateClient).not.toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/error");
    });
  });

  describe("edge cases", () => {
    beforeEach(() => {
      mockCreateClient.mockResolvedValue({
        auth: {
          verifyOtp: vi.fn().mockResolvedValue({ error: null }),
        },
      });
    });

    it("handles empty string parameters correctly", async () => {
      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=&type=&next=",
      );

      await expect(GET(request)).rejects.toThrow("Redirect to: /error");
      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it("handles special characters in next URL", async () => {
      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=abc123&type=email&next=/profile%3Ftab%3Dsettings",
      );

      await expect(GET(request)).rejects.toThrow(
        "Redirect to: /profile?tab=settings",
      );
      expect(mockCreateClient).toHaveBeenCalledOnce();
    });

    it("handles different OTP types", async () => {
      const mockVerifyOtp = vi.fn().mockResolvedValue({ error: null });
      mockCreateClient.mockResolvedValue({
        auth: {
          verifyOtp: mockVerifyOtp,
        },
      });

      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=abc123&type=recovery&next=/",
      );

      await expect(GET(request)).rejects.toThrow("Redirect to: /");
      expect(mockVerifyOtp).toHaveBeenCalledWith({
        type: "recovery",
        token_hash: "abc123",
      });
    });
  });

  describe("Supabase client errors", () => {
    it("throws error when Supabase client creation fails", async () => {
      mockCreateClient.mockRejectedValue(
        new Error("Database connection failed"),
      );

      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=abc123&type=email&next=/dashboard",
      );

      await expect(GET(request)).rejects.toThrow("Database connection failed");
      expect(mockCreateClient).toHaveBeenCalledOnce();
    });

    it("throws error when verifyOtp fails", async () => {
      mockCreateClient.mockResolvedValue({
        auth: {
          verifyOtp: vi.fn().mockRejectedValue(new Error("Network error")),
        },
      });

      const request = new NextRequest(
        "https://example.com/auth/confirm?token_hash=abc123&type=email&next=/dashboard",
      );

      await expect(GET(request)).rejects.toThrow("Network error");
      expect(mockCreateClient).toHaveBeenCalledOnce();
    });
  });
});
