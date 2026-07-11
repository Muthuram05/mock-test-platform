import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mocks } from "../../mock/mockData";
import Logo from "../../common/Logo";
import styles from "./style.module.css";

export default function Landing() {
  const navigate = useNavigate();
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (waitlistEmail.includes("@")) setJoined(true);
  };

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <Logo size={24} />
          <span className={styles.navTitle}>Aspiro Hub</span>
          <span className={styles.badge}>Beta</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLink}>About Us</a>
          <a href="#mocks" className={styles.navLink}>Aspiro Mocks</a>
          <button onClick={() => navigate("/exam/34")} className={styles.navBtn}>
            Join Waitlist <span>›</span>
          </button>
        </div>
      </nav>

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Aspiro Mocks</h1>
        <p className={styles.heroSub}>a simplified online mock test platform</p>
        <p className={styles.heroDesc}>
          Our flagship sub-platform designed specifically to bridge the gap between mentors and
          online students. We make exam preparation realistic, accessible, and extremely easy.
        </p>

        {!joined ? (
          <div className={styles.waitlistRow}>
            <input
              type="email"
              placeholder="Enter your email"
              value={waitlistEmail}
              onChange={e => setWaitlistEmail(e.target.value)}
              className={styles.waitlistInput}
            />
            <button onClick={handleJoin} className={styles.waitlistBtn}>Join Waitlist</button>
          </div>
        ) : (
          <div className={styles.joinedBadge}>You're on the waitlist!</div>
        )}

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Try the Realistic Exam Simulator</h2>
          <p className={styles.ctaDesc}>
            Experience the exact high-fidelity layout used in professional computerized test centers<br />
            to practice under real exam conditions.
          </p>
          <button onClick={() => navigate("/exam/34")} className={styles.ctaBtn}>
            Try Demo Exam →
          </button>
        </div>
      </div>

      <div id="mocks" className={styles.mockList}>
        <h2 className={styles.mockListTitle}>Available Mock Tests</h2>
        <div className={styles.mockCards}>
          {mocks.map(mock => (
            <div key={mock.id} className={styles.mockCard}>
              <div className={styles.mockInfo}>
                <div className={styles.mockTitle}>{mock.title}</div>
                <div className={styles.mockMeta}>
                  <span>📅 {mock.startTime}</span>
                  <span>👥 {Number(mock.students).toLocaleString()} students</span>
                  <span>📝 {mock.sections.reduce((a, s) => a + s.questions.length, 0)} questions</span>
                </div>
              </div>
              <button onClick={() => navigate(`/exam/${mock.id}`)} className={styles.startBtn}>
                Start Mock
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        © 2024 Aspiro Hub · Built for serious exam aspirants
      </div>
    </div>
  );
}
