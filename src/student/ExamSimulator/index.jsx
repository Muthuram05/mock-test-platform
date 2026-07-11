import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mocks } from "../../mock/mockData";
import Logo from "../../common/Logo";
import styles from "./style.module.css";

const STATUS = {
  NOT_VISITED: "not_visited", NOT_ANSWERED: "not_answered",
  ANSWERED: "answered", MARKED: "marked", ANSWERED_MARKED: "answered_marked",
};

const STATUS_STYLE = {
  [STATUS.NOT_VISITED]:    { background: "#fff",     border: "1.5px solid #ddd",     color: "#555" },
  [STATUS.NOT_ANSWERED]:   { background: "#fee2e2",  border: "1.5px solid #fca5a5",  color: "#dc2626" },
  [STATUS.ANSWERED]:       { background: "#22c55e",  border: "1.5px solid #22c55e",  color: "#fff" },
  [STATUS.MARKED]:         { background: "#a855f7",  border: "1.5px solid #a855f7",  color: "#fff" },
  [STATUS.ANSWERED_MARKED]:{ background: "#a855f7",  border: "1.5px solid #a855f7",  color: "#fff" },
};

const LEGEND = [
  { status: STATUS.ANSWERED,        label: "Answered" },
  { status: STATUS.NOT_ANSWERED,    label: "Not Answered" },
  { status: STATUS.NOT_VISITED,     label: "Not Visited" },
  { status: STATUS.MARKED,          label: "Marked for Review" },
  { status: STATUS.ANSWERED_MARKED, label: "Answered & Marked" },
];

function formatTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

function ResultScreen({ questions, answers, statuses, onRetry, navigate }) {
  const correct = questions.filter((q, i) => answers[i] === q.correct).length;
  const attempted = Object.values(statuses).filter(s => s === STATUS.ANSWERED || s === STATUS.ANSWERED_MARKED).length;
  const score = questions.reduce((sum, q, i) => answers[i] === undefined ? sum : sum + (answers[i] === q.correct ? 2 : -0.5), 0);

  const stats = [
    { label: "Score",           value: score.toFixed(1), color: score >= 0 ? "var(--color-success)" : "var(--color-danger)" },
    { label: "Correct",         value: correct,           color: "var(--color-success)" },
    { label: "Attempted",       value: attempted,         color: "var(--color-info)" },
    { label: "Total Questions", value: questions.length,  color: "var(--color-primary)" },
  ];

  return (
    <div className={styles.resultPage}>
      <div className={styles.resultCard}>
        <Logo size={48} />
        <h2 className={styles.resultTitle}>Test Submitted!</h2>
        <p className={styles.resultSubtitle}>Here's your performance summary</p>
        <div className={styles.resultGrid}>
          {stats.map(s => (
            <div key={s.label} className={styles.resultStat}>
              <div className={styles.resultStatLabel}>{s.label.toUpperCase()}</div>
              <div className={styles.resultStatValue} style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className={styles.reviewSection}>
          <div className={styles.reviewTitle}>Answer Review</div>
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correct;
            const isAttempted = answers[i] !== undefined;
            return (
              <div key={i} className={styles.reviewItem}>
                <div className={styles.reviewItemText}>Q{i + 1}. {q.text.slice(0, 60)}...</div>
                <div className={styles.reviewItemAnswers}>
                  <span>Your answer: <strong style={{ color: isAttempted ? (isCorrect ? "var(--color-success)" : "var(--color-danger)") : "var(--color-text-light)" }}>{isAttempted ? q.options[answers[i]] : "Not attempted"}</strong></span>
                  {!isCorrect && <span>Correct: <strong style={{ color: "var(--color-success)" }}>{q.options[q.correct]}</strong></span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.resultActions}>
          <button onClick={onRetry} className={styles.retryBtn}>Retry Test</button>
          <button onClick={() => navigate("/")} className={styles.homeBtn}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default function ExamSimulator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mock = mocks.find(m => m.id === Number(id)) || mocks[0];

  const allQuestions = mock.sections
    .flatMap(s => s.questions.map(q => ({ ...q, sectionId: s.id, sectionName: s.name, sectionMarks: s.marks })))
    .map((q, i) => ({ ...q, globalIndex: i }));

  const totalSeconds = mock.sections.reduce((a, s) => a + s.duration * 60, 0);

  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [statuses, setStatuses] = useState(() => Object.fromEntries(allQuestions.map((_, i) => [i, STATUS.NOT_VISITED])));
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const sectionQuestions = mock.sections[activeSectionIdx]?.questions || [];
  const globalOffset = mock.sections.slice(0, activeSectionIdx).reduce((a, s) => a + s.questions.length, 0);
  const globalQIdx = globalOffset + currentQIdx;
  const currentQ = allQuestions[globalQIdx];
  const currentMarks = mock.sections[activeSectionIdx]?.marks;

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(interval); setSubmitted(true); return 0; } return t - 1; }), 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  useEffect(() => {
    setSelectedOption(answers[globalQIdx] ?? null);
    setStatuses(prev => ({ ...prev, [globalQIdx]: prev[globalQIdx] === STATUS.NOT_VISITED ? STATUS.NOT_ANSWERED : prev[globalQIdx] }));
  }, [globalQIdx]);

  const goNext = () => {
    if (currentQIdx < sectionQuestions.length - 1) setCurrentQIdx(i => i + 1);
    else if (activeSectionIdx < mock.sections.length - 1) { setActiveSectionIdx(s => s + 1); setCurrentQIdx(0); }
  };

  const saveAndNext = () => {
    if (selectedOption !== null) {
      setAnswers(prev => ({ ...prev, [globalQIdx]: selectedOption }));
      setStatuses(prev => ({ ...prev, [globalQIdx]: prev[globalQIdx] === STATUS.MARKED || prev[globalQIdx] === STATUS.ANSWERED_MARKED ? STATUS.ANSWERED_MARKED : STATUS.ANSWERED }));
    } else {
      setStatuses(prev => ({ ...prev, [globalQIdx]: STATUS.NOT_ANSWERED }));
    }
    goNext();
  };

  const markAndNext = () => {
    if (selectedOption !== null) { setAnswers(prev => ({ ...prev, [globalQIdx]: selectedOption })); setStatuses(prev => ({ ...prev, [globalQIdx]: STATUS.ANSWERED_MARKED })); }
    else { setStatuses(prev => ({ ...prev, [globalQIdx]: STATUS.MARKED })); }
    goNext();
  };

  const clearResponse = () => {
    setSelectedOption(null);
    setAnswers(prev => { const n = { ...prev }; delete n[globalQIdx]; return n; });
    setStatuses(prev => ({ ...prev, [globalQIdx]: STATUS.NOT_ANSWERED }));
  };

  const goPrev = () => {
    if (currentQIdx > 0) setCurrentQIdx(i => i - 1);
    else if (activeSectionIdx > 0) { const p = activeSectionIdx - 1; setActiveSectionIdx(p); setCurrentQIdx(mock.sections[p].questions.length - 1); }
  };

  const jumpTo = (gIdx) => {
    let off = 0;
    for (let si = 0; si < mock.sections.length; si++) {
      const len = mock.sections[si].questions.length;
      if (gIdx < off + len) { setActiveSectionIdx(si); setCurrentQIdx(gIdx - off); return; }
      off += len;
    }
  };

  const countByStatus = (s) => Object.values(statuses).filter(v => v === s).length;
  const handleSubmit = () => { saveAndNext(); setSubmitted(true); setConfirmSubmit(false); };
  const handleRetry = () => {
    setAnswers({}); setStatuses(Object.fromEntries(allQuestions.map((_, i) => [i, STATUS.NOT_VISITED])));
    setTimeLeft(totalSeconds); setSubmitted(false); setSelectedOption(null); setActiveSectionIdx(0); setCurrentQIdx(0);
  };

  if (submitted) return <ResultScreen questions={allQuestions} answers={answers} statuses={statuses} onRetry={handleRetry} navigate={navigate} />;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Logo size={20} />
        <span className={styles.examTitle}>{mock.title}</span>
        <div className={styles.spacer} />
        <div className={styles.timerWrap}>
          <span>Time Left:</span>
          <span className={styles.timer} style={{ color: timeLeft < 300 ? "var(--color-danger)" : "var(--color-primary)" }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className={styles.sectionTabs}>
        {mock.sections.map((sec, si) => (
          <button key={sec.id} onClick={() => { setActiveSectionIdx(si); setCurrentQIdx(0); }}
            className={`${styles.sectionTab} ${si === activeSectionIdx ? styles.sectionTabActive : ""}`}>
            Section {si + 1}
          </button>
        ))}
      </div>

      <div className={styles.marksBar}>
        <span>Marks for correct answer: <strong className={styles.marksCorrect}>+{currentMarks?.correct}</strong></span>
        <span>Negative Marks: <strong className={styles.marksDanger}>-{currentMarks?.wrong}</strong></span>
      </div>

      <div className={styles.main}>
        <div className={styles.questionPanel}>
          {currentQ ? (
            <div className={styles.questionCard}>
              <div className={styles.questionNum}>Question No: {globalQIdx + 1}</div>
              <div className={styles.questionText}>
                {currentQ.text.split("\n\n").map((para, pi) => <p key={pi}>{para}</p>)}
              </div>
              <div className={styles.options}>
                {currentQ.options.map((opt, oi) => {
                  const isSelected = selectedOption === oi;
                  return (
                    <button key={oi} onClick={() => setSelectedOption(oi)}
                      className={`${styles.optionBtn} ${isSelected ? styles.optionBtnSelected : ""}`}>
                      <span className={`${styles.radio} ${isSelected ? styles.radioSelected : ""}`}>
                        {isSelected && <span className={styles.radioDot} />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={styles.emptySection}>No questions in this section.</div>
          )}

          <div className={styles.actionRow}>
            <button onClick={markAndNext} className={styles.markBtn}>Mark for Review & Next</button>
            <button onClick={clearResponse} className={styles.clearBtn}>Clear Response</button>
            <div className={styles.spacer} />
            <button onClick={goPrev} className={styles.prevBtn}>Previous</button>
            <button onClick={saveAndNext} className={styles.saveBtn}>Save & Next</button>
            <button onClick={() => setConfirmSubmit(true)} className={styles.submitBtn}>Submit</button>
          </div>
        </div>

        <div className={styles.palette}>
          <div className={styles.userChip}>
            <div className={styles.userAvatar}>👤</div>
            <div className={styles.userLabel}>Student</div>
          </div>

          <div className={styles.legend}>
            {LEGEND.map(({ status, label }) => {
              const s = STATUS_STYLE[status];
              return (
                <div key={status} className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: s.background, border: s.border }} />
                  <span>{countByStatus(status)} {label}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.paletteDivider} />

          {mock.sections.map((sec, si) => {
            const offset = mock.sections.slice(0, si).reduce((a, s) => a + s.questions.length, 0);
            return (
              <div key={sec.id} className={styles.paletteSection}>
                <div className={styles.paletteSectionLabel}>Section {si + 1}</div>
                <div className={styles.paletteGrid}>
                  {sec.questions.map((_, qi) => {
                    const gIdx = offset + qi;
                    const isCurrent = gIdx === globalQIdx;
                    const s = STATUS_STYLE[statuses[gIdx]];
                    return (
                      <button key={qi} onClick={() => jumpTo(gIdx)} className={styles.paletteBtn}
                        style={{
                          background: s.background, color: s.color,
                          border: isCurrent ? `2px solid var(--color-primary)` : s.border,
                          outline: isCurrent ? `2px solid var(--color-primary)` : "none",
                          outlineOffset: 1,
                        }}>
                        {qi + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {confirmSubmit && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3 className={styles.modalTitle}>Submit Test?</h3>
            <p className={styles.modalDesc}>
              You have {countByStatus(STATUS.NOT_VISITED) + countByStatus(STATUS.NOT_ANSWERED)} unanswered questions. Are you sure you want to submit?
            </p>
            <div className={styles.modalActions}>
              <button onClick={() => setConfirmSubmit(false)} className={styles.modalCancelBtn}>Cancel</button>
              <button onClick={handleSubmit} className={styles.modalConfirmBtn}>Yes, Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
