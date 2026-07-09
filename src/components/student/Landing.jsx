import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mocks } from "../../data/mockData";
import Logo from "../shared/Logo";

export default function Landing() {
  const navigate = useNavigate();
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (waitlistEmail.includes("@")) { setJoined(true); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", padding: "0 48px", height: 60, borderBottom: "1px solid #eee", position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <Logo size={24} />
          <span style={{ fontWeight: 800, fontSize: 15, color: "#111" }}>Aspiro Hub</span>
          <span style={{ background: "#e0f2fe", color: "#0284c7", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, marginLeft: 4 }}>Beta</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <a href="#" style={{ color: "#555", textDecoration: "none", fontSize: 14 }}>About Us</a>
          <a href="#mocks" style={{ color: "#555", textDecoration: "none", fontSize: 14 }}>Aspiro Mocks</a>
          <button
            onClick={() => navigate("/student/exam/34")}
            style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            Join Waitlist <span>›</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 60px" }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: "#111", margin: "0 0 16px", lineHeight: 1.15 }}>
          Aspiro Mocks
        </h1>
        <p style={{ fontSize: 17, color: "#555", margin: "0 0 8px", fontWeight: 400 }}>
          a simplified online mock test platform
        </p>
        <p style={{ fontSize: 14, color: "#888", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Our flagship sub-platform designed specifically to bridge the gap between mentors and online students. We make exam preparation realistic, accessible, and extremely easy.
        </p>

        {/* Waitlist */}
        {!joined ? (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", maxWidth: 400, margin: "0 auto 60px" }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={waitlistEmail}
              onChange={e => setWaitlistEmail(e.target.value)}
              style={{ flex: 1, border: "1.5px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none" }}
            />
            <button onClick={handleJoin} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              Join Waitlist
            </button>
          </div>
        ) : (
          <div style={{ background: "#dcfce7", color: "#15803d", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, display: "inline-block", marginBottom: 60 }}>
            You're on the waitlist!
          </div>
        )}

        {/* Demo CTA */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 10 }}>Try the Realistic Exam Simulator</h2>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
            Experience the exact high-fidelity layout used in professional computerized test centers<br />to practice under real exam conditions.
          </p>
          <button
            onClick={() => navigate("/student/exam/34")}
            style={{ background: "#111", color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
          >
            Try Demo Exam →
          </button>
        </div>
      </div>

      {/* Mock List */}
      <div id="mocks" style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 20 }}>Available Mock Tests</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mocks.map(mock => (
            <div key={mock.id} style={{
              border: "1.5px solid #eee", borderRadius: 12, padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 16,
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginBottom: 6 }}>{mock.title}</div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#888" }}>
                  <span>📅 {mock.startTime}</span>
                  <span>👥 {Number(mock.students).toLocaleString()} students</span>
                  <span>📝 {mock.sections.reduce((a, s) => a + s.questions.length, 0)} questions</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/student/exam/${mock.id}`)}
                style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Start Mock
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #eee", padding: "24px", textAlign: "center", fontSize: 13, color: "#aaa" }}>
        © 2024 Aspiro Hub · Built for serious exam aspirants
      </div>
    </div>
  );
}
