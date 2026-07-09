import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mocks } from "../../data/mockData";
import Logo from "../shared/Logo";

const STATUS = { NOT_VISITED: "not_visited", NOT_ANSWERED: "not_answered", ANSWERED: "answered", MARKED: "marked", ANSWERED_MARKED: "answered_marked" };

const statusColors = {
  [STATUS.NOT_VISITED]: { bg: "#fff", border: "#ddd", text: "#555" },
  [STATUS.NOT_ANSWERED]: { bg: "#fee2e2", border: "#fca5a5", text: "#dc2626" },
  [STATUS.ANSWERED]: { bg: "#22c55e", border: "#22c55e", text: "#fff" },
  [STATUS.MARKED]: { bg: "#a855f7", border: "#a855f7", text: "#fff" },
  [STATUS.ANSWERED_MARKED]: { bg: "#a855f7", border: "#a855f7", text: "#fff" },
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function ResultScreen({ questions, answers, statuses, totalDuration, onRetry, navigate }) {
  const correct = questions.filter((q, i) => answers[i] === q.correct).length;
  const attempted = Object.values(statuses).filter(s => s === STATUS.ANSWERED || s === STATUS.ANSWERED_MARKED).length;
  const score = questions.reduce((sum, q, i) => {
    if (answers[i] === undefined) return sum;
    return sum + (answers[i] === q.correct ? 2 : -0.5);
  }, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 48, maxWidth: 520, width: "100%", textAlign: "center", border: "1px solid #eee" }}>
        <Logo size={48} />
        <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 16, marginBottom: 4 }}>Test Submitted!</h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>Here's your performance summary</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Score", value: score.toFixed(1), color: score >= 0 ? "#22c55e" : "#ef4444" },
            { label: "Correct", value: correct, color: "#22c55e" },
            { label: "Attempted", value: attempted, color: "#3b82f6" },
            { label: "Total Questions", value: questions.length, color: "#111" },
          ].map(s => (
            <div key={s.label} style={{ background: "#f9f9f9", borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        {/* Answer review */}
        <div style={{ textAlign: "left", marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Answer Review</div>
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correct;
            const isAttempted = answers[i] !== undefined;
            return (
              <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: 13, color: "#333", marginBottom: 6 }}>Q{i + 1}. {q.text.slice(0, 60)}...</div>
                <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                  <span style={{ color: "#888" }}>Your answer: <strong style={{ color: isAttempted ? (isCorrect ? "#22c55e" : "#ef4444") : "#aaa" }}>{isAttempted ? q.options[answers[i]] : "Not attempted"}</strong></span>
                  {!isCorrect && <span style={{ color: "#888" }}>Correct: <strong style={{ color: "#22c55e" }}>{q.options[q.correct]}</strong></span>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onRetry} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Retry Test</button>
          <button onClick={() => navigate("/student")} style={{ background: "#f5f5f5", color: "#333", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default function ExamSimulator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mock = mocks.find(m => m.id === Number(id)) || mocks[0];

  // Flatten all questions with section info
  const allQuestions = mock.sections.flatMap((s, si) =>
    s.questions.map((q, qi) => ({ ...q, sectionId: s.id, sectionName: s.name, sectionMarks: s.marks, globalIndex: 0 }))
  ).map((q, i) => ({ ...q, globalIndex: i }));

  const totalSeconds = mock.sections.reduce((a, s) => a + s.duration * 60, 0);

  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [statuses, setStatuses] = useState(() => Object.fromEntries(allQuestions.map((_, i) => [i, STATUS.NOT_VISITED])));
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  // Current section questions
  const sectionQuestions = mock.sections[activeSectionIdx]?.questions || [];
  const globalOffset = mock.sections.slice(0, activeSectionIdx).reduce((a, s) => a + s.questions.length, 0);
  const globalQIdx = globalOffset + currentQIdx;
  const currentQ = allQuestions[globalQIdx];
  const currentMarks = mock.sections[activeSectionIdx]?.marks;

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); setSubmitted(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  useEffect(() => {
    setSelectedOption(answers[globalQIdx] ?? null);
    setStatuses(prev => ({
      ...prev,
      [globalQIdx]: prev[globalQIdx] === STATUS.NOT_VISITED ? STATUS.NOT_ANSWERED : prev[globalQIdx],
    }));
  }, [globalQIdx]);

  const saveAndNext = () => {
    if (selectedOption !== null) {
      setAnswers(prev => ({ ...prev, [globalQIdx]: selectedOption }));
      setStatuses(prev => ({
        ...prev,
        [globalQIdx]: prev[globalQIdx] === STATUS.MARKED || prev[globalQIdx] === STATUS.ANSWERED_MARKED
          ? STATUS.ANSWERED_MARKED : STATUS.ANSWERED,
      }));
    } else {
      setStatuses(prev => ({ ...prev, [globalQIdx]: STATUS.NOT_ANSWERED }));
    }
    goNext();
  };

  const markAndNext = () => {
    if (selectedOption !== null) {
      setAnswers(prev => ({ ...prev, [globalQIdx]: selectedOption }));
      setStatuses(prev => ({ ...prev, [globalQIdx]: STATUS.ANSWERED_MARKED }));
    } else {
      setStatuses(prev => ({ ...prev, [globalQIdx]: STATUS.MARKED }));
    }
    goNext();
  };

  const clearResponse = () => {
    setSelectedOption(null);
    setAnswers(prev => { const next = { ...prev }; delete next[globalQIdx]; return next; });
    setStatuses(prev => ({ ...prev, [globalQIdx]: STATUS.NOT_ANSWERED }));
  };

  const goNext = () => {
    if (currentQIdx < sectionQuestions.length - 1) {
      setCurrentQIdx(i => i + 1);
    } else if (activeSectionIdx < mock.sections.length - 1) {
      setActiveSectionIdx(s => s + 1);
      setCurrentQIdx(0);
    }
  };

  const goPrev = () => {
    if (currentQIdx > 0) setCurrentQIdx(i => i - 1);
    else if (activeSectionIdx > 0) {
      const prevSec = activeSectionIdx - 1;
      setActiveSectionIdx(prevSec);
      setCurrentQIdx(mock.sections[prevSec].questions.length - 1);
    }
  };

  const jumpTo = (globalIdx) => {
    let offset = 0;
    for (let si = 0; si < mock.sections.length; si++) {
      const len = mock.sections[si].questions.length;
      if (globalIdx < offset + len) {
        setActiveSectionIdx(si);
        setCurrentQIdx(globalIdx - offset);
        return;
      }
      offset += len;
    }
  };

  const handleSubmit = () => {
    saveAndNext();
    setSubmitted(true);
    setConfirmSubmit(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setStatuses(Object.fromEntries(allQuestions.map((_, i) => [i, STATUS.NOT_VISITED])));
    setTimeLeft(totalSeconds);
    setSubmitted(false);
    setSelectedOption(null);
    setActiveSectionIdx(0);
    setCurrentQIdx(0);
  };

  const countByStatus = (s) => Object.values(statuses).filter(v => v === s).length;

  if (submitted) {
    return <ResultScreen questions={allQuestions} answers={answers} statuses={statuses} totalDuration={totalSeconds} onRetry={handleRetry} navigate={navigate} />;
  }

  const timerColor = timeLeft < 300 ? "#ef4444" : "#111";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 20px", height: 48, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
        <Logo size={20} />
        <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{mock.title}</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", align: "center", gap: 8, fontSize: 13, color: "#555" }}>
          <span>Time Left:</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: timerColor, fontVariantNumeric: "tabular-nums" }}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 20px", display: "flex", gap: 4, overflowX: "auto" }}>
        {mock.sections.map((sec, si) => (
          <button key={sec.id} onClick={() => { setActiveSectionIdx(si); setCurrentQIdx(0); }}
            style={{
              padding: "10px 16px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: si === activeSectionIdx ? "#111" : "transparent",
              color: si === activeSectionIdx ? "#fff" : "#555",
              borderRadius: "6px 6px 0 0", marginBottom: -1,
            }}>
            Section {si + 1}
          </button>
        ))}
      </div>

      {/* Marks info */}
      <div style={{ background: "#fafafa", borderBottom: "1px solid #eee", padding: "6px 20px", display: "flex", gap: 20, fontSize: 12, color: "#555" }}>
        <span>Marks for correct answer: <strong style={{ color: "#22c55e" }}>+{currentMarks?.correct}</strong></span>
        <span>Negative Marks: <strong style={{ color: "#ef4444" }}>-{currentMarks?.wrong}</strong></span>
      </div>

      <div style={{ display: "flex", gap: 0, minHeight: "calc(100vh - 120px)" }}>
        {/* Question Panel */}
        <div style={{ flex: 1, padding: 24, minWidth: 0 }}>
          {currentQ ? (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: 28, minHeight: 420 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12 }}>
                Question No: {globalQIdx + 1}
              </div>
              {/* Question text — handles comprehension passages */}
              <div style={{ fontSize: 14, color: "#222", lineHeight: 1.7, marginBottom: 24 }}>
                {currentQ.text.split("\n\n").map((para, pi) => (
                  <p key={pi} style={{ marginBottom: 12, margin: pi < currentQ.text.split("\n\n").length - 1 ? "0 0 14px" : 0 }}>{para}</p>
                ))}
              </div>
              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {currentQ.options.map((opt, oi) => {
                  const isSelected = selectedOption === oi;
                  return (
                    <button key={oi} onClick={() => setSelectedOption(oi)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px", border: `1.5px solid ${isSelected ? "#111" : "#e5e7eb"}`,
                        borderRadius: 8, background: isSelected ? "#f0f0f0" : "#fff",
                        cursor: "pointer", textAlign: "left", fontSize: 14, color: "#222",
                        transition: "all 0.1s", fontFamily: "inherit",
                      }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%",
                        border: `2px solid ${isSelected ? "#111" : "#ddd"}`,
                        background: isSelected ? "#111" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {isSelected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 12, padding: 48, textAlign: "center", color: "#aaa" }}>
              No questions in this section.
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button onClick={markAndNext} style={{ background: "#a855f7", color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Mark for Review & Next
            </button>
            <button onClick={clearResponse} style={{ background: "#fff", color: "#555", border: "1px solid #ddd", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Clear Response
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={goPrev} style={{ background: "#fff", color: "#555", border: "1px solid #ddd", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Previous
            </button>
            <button onClick={saveAndNext} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Save & Next
            </button>
            <button onClick={() => setConfirmSubmit(true)} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Submit
            </button>
          </div>
        </div>

        {/* Right sidebar — question palette */}
        <div style={{ width: 220, background: "#fff", borderLeft: "1px solid #eee", padding: 16, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          {/* User info */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f9f9f9", borderRadius: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>Student</div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { status: STATUS.ANSWERED, label: "Answered" },
              { status: STATUS.NOT_ANSWERED, label: "Not Answered" },
              { status: STATUS.NOT_VISITED, label: "Not Visited" },
              { status: STATUS.MARKED, label: "Marked for Review" },
              { status: STATUS.ANSWERED_MARKED, label: "Answered & Marked" },
            ].map(({ status, label }) => {
              const c = statusColors[status];
              return (
                <div key={status} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#555" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: c.bg, border: `1.5px solid ${c.border}`, flexShrink: 0 }} />
                  <span>{countByStatus(status)} {label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: "1px solid #eee" }} />

          {/* Question palette per section */}
          {mock.sections.map((sec, si) => {
            const offset = mock.sections.slice(0, si).reduce((a, s) => a + s.questions.length, 0);
            return (
              <div key={sec.id}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 8 }}>Section {si + 1}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {sec.questions.map((_, qi) => {
                    const gIdx = offset + qi;
                    const isCurrent = gIdx === globalQIdx;
                    const c = statusColors[statuses[gIdx]];
                    return (
                      <button key={qi} onClick={() => jumpTo(gIdx)}
                        style={{
                          width: 28, height: 28, borderRadius: 4, border: isCurrent ? "2px solid #111" : `1.5px solid ${c.border}`,
                          background: c.bg, color: c.text, fontSize: 11, fontWeight: 700, cursor: "pointer",
                          outline: isCurrent ? "2px solid #111" : "none", outlineOffset: 1,
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

      {/* Confirm submit modal */}
      {confirmSubmit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>Submit Test?</h3>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
              You have {countByStatus(STATUS.NOT_VISITED) + countByStatus(STATUS.NOT_ANSWERED)} unanswered questions. Are you sure you want to submit?
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirmSubmit(false)} style={{ background: "#f5f5f5", color: "#333", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSubmit} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Yes, Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
