import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Logo from "../Logo";
import styles from "./style.module.css";

export default function Login() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === "teacher" ? "/teacher" : "/", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = login(email.trim(), password);
      setLoading(false);
      if (!user) { setError("Invalid email or password."); return; }
      const from = location.state?.from;
      if (from?.startsWith("/teacher") && user.role !== "teacher") {
        setError("You do not have teacher access."); return;
      }
      const defaultPath = user.role === "teacher" ? "/teacher" : "/";
      navigate(from || defaultPath, { replace: true });
    }, 400);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <Logo size={44} />
          <div>
            <div className={styles.appName}>Aspiro Mocks</div>
            <div className={styles.subtitle}>Sign in to your account</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              required
              autoFocus
              className={`${styles.input} ${error ? styles.inputError : ""}`}
            />
          </div>

          <div>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrap}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                required
                className={`${styles.input} ${styles.passwordInput} ${error ? styles.inputError : ""}`}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className={styles.togglePassword}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.demoBox}>
          <div className={styles.demoTitle}>Demo accounts</div>
          <div>🎓 Teacher: <code>teacher@aspiro.com</code> / <code>teacher123</code></div>
          <div>📚 Student: <code>rahul@gmail.com</code> / <code>rahul123</code></div>
        </div>
      </div>
    </div>
  );
}
