import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // Account created successfully
      router.push("/login");
    } catch (e) {
      setError(e.message || "Unable to create account.");
      setLoading(false);
    }
  }

  return (
    <Navbar>
      <div className="centered-page">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Create an Account</h2>

          <p className="subtitle">
            Create your account to use ZoomClone.
          </p>

          {error && (
            <div className="error-text">
              {error}
            </div>
          )}

          <div className="field">
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) =>
                update("name", e.target.value)
              }
            />
          </div>

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
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) =>
                update("password", e.target.value)
              }
            />
          </div>

          <div className="field">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Enter password again"
              value={form.confirmPassword}
              onChange={(e) =>
                update("confirmPassword", e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "14px",
            }}
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              style={{
                border: "none",
                background: "none",
                padding: 0,
                cursor: "pointer",
                fontWeight: 600,
                color: "#2d8cff",
              }}
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </Navbar>
  );
}