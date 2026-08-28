"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Something went wrong creating your account.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("That email and password don't match our records.");
        setLoading(false);
        return;
      }

      router.push("/portal/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.65rem 0.85rem",
    background: "var(--color-bg)",
    border: "1px solid var(--color-line)",
    borderRadius: "0.35rem",
    color: "var(--color-ink)",
    fontFamily: "inherit",
    fontSize: "var(--step-1)",
  };

  return (
    <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - var(--header-height) - var(--footer-height))" }}>
      {/* Left: form panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "var(--space-xl)",
        }}
      >
        <div style={{ maxWidth: "24rem", width: "100%", marginInline: "auto" }}>
          <p className="eyebrow" style={{ color: "var(--color-accent)" }}>Client Portal</p>
          <h1 style={{ marginBottom: "var(--space-sm)" }}>
            {mode === "login" ? "Log in" : "Create your account"}
          </h1>

          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-line)",
              borderRadius: "0.5rem",
              padding: "var(--space-lg)",
              boxShadow: "0 10px 30px rgba(20,17,14,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            {mode === "signup" && (
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={inputStyle}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: "var(--space-xs)" }}
            >
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p style={{ marginTop: "var(--space-sm)", fontSize: "var(--step-1)" }}>
            {mode === "login" ? (
              <>
                New patient?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  style={{
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "var(--color-accent)",
                  }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  style={{
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "var(--color-accent)",
                  }}
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right: photo + brand mark panel, echoes the homepage hero */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: "url(/longevity/photo-mountain-sunset.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(20,17,14,0.55) 0%, rgba(20,17,14,0.1) 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "13rem",
            height: "13rem",
          }}
        >
          
          
        </div>
        <p
          style={{
            position: "absolute",
            bottom: "var(--space-lg)",
            left: "var(--space-lg)",
            right: "var(--space-lg)",
            color: "var(--color-card)",
            fontSize: "var(--step1)",
            maxWidth: "22rem",
          }}
        >
          The story only your biology can tell.
        </p>
      </div>
    </section>
  );
}