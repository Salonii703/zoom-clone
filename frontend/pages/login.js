import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const user = await api.login({
        email: form.email.trim(),
        password: form.password,
      });

      // Save logged-in user in browser
      localStorage.setItem("zoomclone_user", JSON.stringify(user));

      // Go to dashboard
      router.push("/");
    } catch (e) {
      setError(e.message || "Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <Navbar>
      <div className="centered-page">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>

          <p className="subtitle">
            Log in to your ZoomClone account.
          </p>

          {error && (
            <div className="error-text">
              {error}
            </div>
          )}

          <div className="field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                update("email", e.target.value)
              }
            />
          </div>

          <div className="field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                update("password", e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "14px",
            }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              style={{
                border: "none",
                background: "none",
                padding: 0,
                cursor: "pointer",
                fontWeight: 600,
                color: "#2d8cff",
              }}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </Navbar>
  );
}