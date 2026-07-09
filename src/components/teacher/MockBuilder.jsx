import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mocks } from "../../data/mockData";
import Logo from "../shared/Logo";

function QuestionModal({ sectionId, onClose, onSave }) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [explanation, setExplanation] = useState("");

  const handleOptionChange = (i, val) => {
    const next = [...options];
    next[i] = val;
    setOptions(next);
  };

  const handleSave = () => {
    if (!text.trim() || options.some(o => !o.trim())) return;
    onSave({ text, options, correct, explanation, type: "mcq" });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 520, maxHeight: "85vh", overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Add Question</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>✕</button>
        </div>
        <label style={labelStyle}>Question Text</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
          style={{ ...inputStyle, resize: "vertical", width: "100%", boxSizing: "border-box" }}
          placeholder="Enter question..." />
        <label style={labelStyle}>Options</label>
        {options.map((opt, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <input type="radio" name="correct" checked={correct === i} onChange={() => setCorrect(i)} />
            <span style={{ fontSize: 12, color: "#888", width: 14 }}>{String.fromCharCode(65 + i)}.</span>
            <input value={opt} onChange={e => handleOptionChange(i, e.target.value)}
              style={{ ...inputStyle, flex: 1 }} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
          </div>
        ))}
        <label style={labelStyle}>Explanation (optional)</label>
        <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={2}
          style={{ ...inputStyle, resize: "vertical", width: "100%", boxSizing: "border-box" }}
          placeholder="Explanation for correct answer..." />
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={handleSave} style={primaryBtnStyle}>Add Question</button>
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ section, index, onChange, onDelete, onAddQuestion, onDeleteQuestion }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: 20, marginBottom: 16, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.08em" }}>SECTION :</span>
        <input
          value={section.name}
          onChange={e => onChange({ ...section, name: e.target.value })}
          style={{ fontWeight: 600, fontSize: 14, border: "none", borderBottom: "1.5px dashed #ddd", outline: "none", background: "transparent", minWidth: 160, padding: "2px 4px" }}
        />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" }}>
          <span style={{ fontWeight: 600, letterSpacing: "0.04em" }}>EACH RIGHT/WRONG OPTIONS</span>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}>
            <span style={{ background: "#dcfce7", color: "#16a34a", fontWeight: 700, padding: "4px 10px" }}>+</span>
            <input type="number" value={section.marks.correct} onChange={e => onChange({ ...section, marks: { ...section.marks, correct: Number(e.target.value) } })}
              style={{ width: 40, border: "none", textAlign: "center", fontSize: 13, fontWeight: 600, outline: "none", padding: "4px 0" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}>
            <span style={{ background: "#fee2e2", color: "#dc2626", fontWeight: 700, padding: "4px 10px" }}>-</span>
            <input type="number" value={section.marks.wrong} onChange={e => onChange({ ...section, marks: { ...section.marks, wrong: Number(e.target.value) } })}
              style={{ width: 40, border: "none", textAlign: "center", fontSize: 13, fontWeight: 600, outline: "none", padding: "4px 0" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>DURATION</span>
          <input type="range" min={10} max={120} value={section.duration}
            onChange={e => onChange({ ...section, duration: Number(e.target.value) })}
            style={{ width: 100, accentColor: "#111" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111", minWidth: 32 }}>{section.duration}m</span>
        </div>
        <button onClick={() => onAddQuestion(section.id)} style={outlineBtnStyle}>+ QUESTIONS</button>
        <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 16 }}>🗑</button>
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14 }}>
          {collapsed ? "▼" : "▲"}
        </button>
      </div>

      {!collapsed && section.questions.length > 0 && (
        <div style={{ marginTop: 16, borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 10 }}>
            {section.questions.length} Question{section.questions.length !== 1 ? "s" : ""}
          </div>
          {section.questions.map((q, qi) => (
            <div key={q.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: qi < section.questions.length - 1 ? "1px solid #f5f5f5" : "none" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa", minWidth: 20 }}>Q{qi + 1}.</span>
              <span style={{ flex: 1, fontSize: 13, color: "#333" }}>{q.text.slice(0, 80)}{q.text.length > 80 ? "..." : ""}</span>
              <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>✓ {q.options[q.correct]}</span>
              <button onClick={() => onDeleteQuestion(section.id, q.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = { border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", fontFamily: "inherit" };
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, marginTop: 14 };
const primaryBtnStyle = { background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" };
const cancelBtnStyle = { background: "#f5f5f5", color: "#555", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" };
const outlineBtnStyle = { background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#555" };

export default function MockBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = id !== "new" ? mocks.find((m) => m.id === Number(id)) : null;

  const [title, setTitle] = useState(existing?.title || "");
  const [sections, setSections] = useState(
    existing?.sections || [{ id: 1, name: "unnamed section", marks: { correct: 2, wrong: 0.5 }, duration: 30, questions: [] }]
  );
  const [addingQuestionTo, setAddingQuestionTo] = useState(null);
  const [saved, setSaved] = useState(false);

  const addSection = () => setSections(prev => [...prev, {
    id: Math.max(...prev.map(s => s.id), 0) + 1,
    name: "unnamed section", marks: { correct: 2, wrong: 0.5 }, duration: 30, questions: [],
  }]);

  const updateSection = (id, updated) => setSections(prev => prev.map(s => s.id === id ? updated : s));
  const deleteSection = (id) => setSections(prev => prev.filter(s => s.id !== id));

  const addQuestion = (sectionId, question) => {
    setSections(prev => prev.map(s => s.id === sectionId ? {
      ...s, questions: [...s.questions, { ...question, id: Date.now() }]
    } : s));
  };

  const deleteQuestion = (sectionId, questionId) => {
    setSections(prev => prev.map(s => s.id === sectionId ? {
      ...s, questions: s.questions.filter(q => q.id !== questionId)
    } : s));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
        <Logo size={22} />
        <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>Aspiro Mock Test Builder</span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {/* Title */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#888", letterSpacing: "0.08em" }}>MOCK TITLE :</span>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="unnamed mock"
            style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit" }}
          />
          <button onClick={handleSave} style={{
            background: saved ? "#22c55e" : "#111", color: "#fff", border: "none", borderRadius: 8,
            padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em",
            transition: "background 0.2s",
          }}>
            {saved ? "SAVED ✓" : "SAVE MOCK"}
          </button>
        </div>

        {/* Sections */}
        <div style={{ background: "#f0f0f0", borderRadius: 12, border: "1.5px dashed #ddd", padding: 20 }}>
          {sections.map((section, i) => (
            <SectionBlock
              key={section.id}
              section={section}
              index={i}
              onChange={(updated) => updateSection(section.id, updated)}
              onDelete={() => deleteSection(section.id)}
              onAddQuestion={(sid) => setAddingQuestionTo(sid)}
              onDeleteQuestion={deleteQuestion}
            />
          ))}

          <div
            onClick={addSection}
            style={{
              border: "1.5px dashed #ccc", borderRadius: 10, padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
              background: "#fff", opacity: 0.8, transition: "opacity 0.15s", marginLeft: "auto", width: "fit-content",
            }}
          >
            <span style={{ fontSize: 22, color: "#555" }}>+</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#333" }}>ADD SECTION</div>
              <div style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>Create another section block on the list below</div>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 32px" }}>
        <button onClick={() => navigate("/teacher")} style={{ ...cancelBtnStyle, display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          ← Back to Dashboard
        </button>
      </div>

      {addingQuestionTo && (
        <QuestionModal
          sectionId={addingQuestionTo}
          onClose={() => setAddingQuestionTo(null)}
          onSave={(q) => addQuestion(addingQuestionTo, q)}
        />
      )}
    </div>
  );
}
