import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mocks } from "../../mock/mockData";
import Logo from "../../common/Logo";
import styles from "./style.module.css";

const IconMonitor = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const IconChart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconGraduation = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 8.5 12 15 2 8.5 12 2"/>
    <polyline points="6 11.5 6 18 12 21.5 18 18 18 11.5"/>
  </svg>
);
const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const IconTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const FEATURES = [
  { icon: <IconMonitor />, title: "Live Mock Exams", desc: "Empower mentors to easily schedule and conduct live mock exams for their students. A stable, realistic exam environment designed for online learning." },
  { icon: <IconChart />, title: "Live Data Tracking", desc: "Track student performance in real-time. Mentors receive instant analytics and live data streams to identify areas where aspirants need the most help." },
  { icon: <IconGraduation />, title: "Aspirant Improvement", desc: "Built specifically to help aspirants improve their study efficiency and exam performance. We make online studying as impactful as offline coaching." },
  { icon: <IconShield />, title: "Dedicated Tech Support", desc: "Comprehensive, responsive technical support is integrated directly into the platform to ensure uninterrupted testing and learning experiences." },
];

function WaitlistModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.includes("@")) setDone(true);
  };

  return (
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <div className={styles.modalTag}>🔒 Beta Access Request</div>
        {done ? (
          <div className={styles.modalSuccess}>
            <div className={styles.modalSuccessIcon}>🎉</div>
            <h3 className={styles.modalTitle}>You're on the list!</h3>
            <p className={styles.modalSubtitle}>We'll reach out to <strong>{email}</strong> before the July 2026 launch.</p>
            <button className={styles.modalBtn} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h3 className={styles.modalTitle}>Join Aspiro Beta Waitlist</h3>
            <p className={styles.modalSubtitle}>Be the first to try out our in-house Mock Exam platform. Launching soon in July 2026.</p>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>YOUR FULL NAME</label>
                <input className={styles.modalInput} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Rajesh Kumar" required />
              </div>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>EMAIL ADDRESS</label>
                <input type="email" className={styles.modalInput} value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g., rajesh@school.com" required />
              </div>
              <button type="submit" className={styles.modalBtn}>Reserve Beta Seat <IconArrow /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  const scrollToMocks = () => document.getElementById("mocks")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={styles.page}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <Logo size={26} />
          <span className={styles.navBrandName}>Aspiro Hub</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#about" className={styles.navLink}>About Us</a>
          <a href="#mocks" className={styles.navLink}>Aspiro Mocks</a>
          <span className={styles.betaBadge}>Beta</span>
        </div>
        <button className={styles.navCta} onClick={() => setShowModal(true)}>Join Waitlist ›</button>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>🚀 Launching July 2026</div>
          <h1 className={styles.heroTitle}>Elevating Online Education<br />Through In-House Innovation</h1>
          <p className={styles.heroSub}>
            Aspiro Hub is setting up for the highly anticipated beta test launch of <strong>Aspiro Mocks</strong>.
            Prepare for a seamless, cost-effective platform designed for mentors and aspirants.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.heroExploreBtn} onClick={scrollToMocks}>Explore Aspiro Mocks <IconArrow /></button>
            <button className={styles.heroWaitlistBtn} onClick={() => setShowModal(true)}>Join Waitlist</button>
          </div>
        </div>
        <div className={styles.heroDecor}>
          <div className={styles.heroDecorCircle1} />
          <div className={styles.heroDecorCircle2} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className={styles.about}>
        <div className={styles.sectionInner}>
          <div className={styles.missionLabel}><span />OUR MISSION<span /></div>
          <h2 className={styles.sectionTitle}>About Aspiro Hub</h2>
          <p className={styles.aboutText}>
            At Aspiro Hub, we believe that high-quality educational technology shouldn't come with exorbitant price tags.
            As a parent company, our mission is to build robust, enterprise-level architectures completely from scratch.
          </p>
          <p className={styles.aboutText}>
            Because we develop everything in-house, we have full control over usability and cost. We are making our
            platforms incredibly easy to use and significantly less costly than anything previously available on the market.
          </p>
        </div>

        <div className={styles.flagshipWrap}>
          <div className={styles.flagshipLabel}>FLAGSHIP PLATFORM</div>
          <h2 className={styles.sectionTitle}>Introducing Aspiro Mocks</h2>
          <p className={styles.flagshipSub}>
            Our flagship sub-platform designed specifically to bridge the gap between mentors and online students.
            We are currently finalizing our Beta Testing stage and getting ready for the official launch.
          </p>
          <div className={styles.featureGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                <button className={styles.learnMore}>Learn more <IconArrow /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOCK LIST */}
      <section id="mocks" className={styles.mockSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Available Mock Tests</h2>
          <p className={styles.mockSectionSub}>Choose a test and start practising under real exam conditions.</p>
          <div className={styles.mockGrid}>
            {mocks.map(mock => (
              <div key={mock.id} className={styles.mockCard}>
                <div className={styles.mockCardHeader}>
                  <span className={styles.mockCardNum}>#{mock.id}</span>
                  <span className={styles.mockCardBadge}>{mock.sections.length} Section{mock.sections.length !== 1 ? "s" : ""}</span>
                </div>
                <h3 className={styles.mockCardTitle}>{mock.title}</h3>
                <div className={styles.mockCardMeta}>
                  <span className={styles.mockCardMetaItem}>📅 {mock.startTime}</span>
                  <span className={styles.mockCardMetaItem}>👥 {Number(mock.students).toLocaleString()} students</span>
                  <span className={styles.mockCardMetaItem}>📝 {mock.sections.reduce((a, s) => a + s.questions.length, 0)} questions</span>
                </div>
                <button className={styles.mockCardBtn} onClick={() => navigate("/exam/" + mock.id)}>
                  Start Exam <IconArrow />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaGlow} />
        <h2 className={styles.ctaTitle}>Uncompromised Quality. Unbeatable Cost.</h2>
        <p className={styles.ctaSub}>
          By bypassing third-party vendors and engineering Aspiro Mocks internally, Aspiro Hub
          guarantees a professional, intuitive, and highly affordable experience for educational
          institutions, mentors, and students alike.
        </p>
        <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>Register for Beta Access <IconArrow /></button>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerCol}>
            <div className={styles.footerBrand}>
              <Logo size={22} />
              <span className={styles.footerBrandName}>Aspiro Hub</span>
            </div>
            <p className={styles.footerTagline}>We build high-quality, easy-to-use platforms in-house, completely from scratch. No expensive licenses mean lower costs for everyone.</p>
            <div className={styles.footerSocials}>
              <a href="#" className={styles.footerSocial}><IconLinkedIn /></a>
              <a href="#" className={styles.footerSocial}><IconTwitter /></a>
              <a href="#" className={styles.footerSocial}><IconInstagram /></a>
            </div>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>PLATFORMS</div>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Aspiro Hub</a>
              <a href="#mocks" className={styles.footerLink}>Aspiro Mocks <span className={styles.footerBeta}>BETA</span></a>
            </div>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>SUPPORT & TRUST</div>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Technical Support</a>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <a href="#" className={styles.footerLink}>Contact Us</a>
            </div>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>GET LATEST UPDATES</div>
            <p className={styles.footerNewsletterDesc}>Enter your email to receive direct beta access invites and launch notifications.</p>
            {newsletterDone ? (
              <div className={styles.footerNewsletterDone}>✓ You're subscribed!</div>
            ) : (
              <form className={styles.footerNewsletterForm} onSubmit={e => { e.preventDefault(); if (newsletterEmail.includes("@")) setNewsletterDone(true); }}>
                <input type="email" className={styles.footerNewsletterInput} placeholder="Your work email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} required />
                <button type="submit" className={styles.footerNewsletterBtn}><IconSend /></button>
              </form>
            )}
            <div className={styles.footerNewsletterEmail}>✉ beta@aspirohub.com</div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 Aspiro Hub Enterprises. All rights reserved. Copyright Protected.</span>
          <span>Built completely in-house with proprietary architecture</span>
        </div>
      </footer>

      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
