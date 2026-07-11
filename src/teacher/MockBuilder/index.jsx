import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mocks } from "../../mock/mockData";
import Logo from "../../common/Logo";
import styles from "./style.module.css";

function QuestionModal({ onClose, onSave }) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [explanation, setExplanation] = useState("");

  const handleOptionChange = (i, val) => {
    const next = [...options]; next[i] = val; setOptions(next);
  };

  const handleSave = () => {
    if (!text.trim() || options.some(o => !o.trim())) return;
    onSave({ text, options, correct, explanation, type: "mcq" });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Add Question</span>
          <button onClick={onClose} className={styles.modalCloseBtn}>✕</button>
        </div>
        <label className={styles.modalLabel}>Question Text</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={3} className={styles.modalTextarea} placeholder="Enter question..." />
        <label className={styles.modalLabel}>Options</label>
        {options.map((opt, i) => (
          <div key={i} className={styles.optionRow}>
            <input type="radio" name="correct" checked={correct === i} onChange={() => setCorrect(i)} />
            <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}.</span>
            <input value={opt} onChange={e => handleOptionChange(i, e.target.value)} className={styles.optionInput} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
          </div>
        ))}
        <label className={styles.modalLabel}>Explanation (optional)</label>
        <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={2} className={styles.modalTextarea} placeholder="Explanation for correct answer..." />
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} className={styles.primaryBtn}>Add Question</button>
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ section, onChange, onDelete, onAddQuestion, onDeleteQuestion }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionRow}>
        <span className={styles.sectionLabel}>SECTION :</span>
        <input value={section.name} onChange={e => onChange({ ...section, name: e.target.value })} className={styles.sectionNameInput} />
        <div className={styles.spacer} />
        <div className={styles.marksGroup}>
          <span className={styles.marksLabel}>EACH RIGHT/WRONG OPTIONS</span>
          <div className={styles.marksPill}>
            <span className={`${styles.marksSign} ${styles.marksSignPositive}`}>+</span>
            <input type="number" value={section.marks.correct} onChange={e => onChange({ ...section, marks: { ...section.marks, correct: Number(e.target.value) } })} className={styles.marksInput} />
          </div>
          <div className={styles.marksPill}>
            <span className={`${styles.marksSign} ${styles.marksSignNegative}`}>-</span>
            <input type="number" value={section.marks.wrong} onChange={e => onChange({ ...section, marks: { ...section.marks, wrong: Number(e.target.value) } })} className={styles.marksInput} />
          </div>
        </div>
        <div className={styles.durationGroup}>
          <span className={styles.durationLabel}>DURATION</span>
          <input type="range" min={10} max={120} value={section.duration} onChange={e => onChange({ ...section, duration: Number(e.target.value) })} className={styles.durationSlider} />
          <span className={styles.durationValue}>{section.duration}m</span>
        </div>
        <button onClick={() => onAddQuestion(section.id)} className={styles.addQuestionsBtn}>+ QUESTIONS</button>
        <button onClick={onDelete} className={styles.deleteSectionBtn}>🗑</button>
        <button onClick={() => setCollapsed(!collapsed)} className={styles.collapseBtn}>{collapsed ? "▼" : "▲"}</button>
      </div>

      {!collapsed && section.questions.length > 0 && (
        <div className={styles.questionsList}>
          <div className={styles.questionsCount}>{section.questions.length} Question{section.questions.length !== 1 ? "s" : ""}</div>
          {section.questions.map((q, qi) => (
            <div key={q.id} className={styles.questionRow}>
              <span className={styles.questionNum}>Q{qi + 1}.</span>
              <span className={styles.questionText}>{q.text.slice(0, 80)}{q.text.length > 80 ? "..." : ""}</span>
              <span className={styles.questionCorrect}>✓ {q.options[q.correct]}</span>
              <button onClick={() => onDeleteQuestion(section.id, q.id)} className={styles.deleteQuestionBtn}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MockBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = id !== "new" ? mocks.find(m => m.id === Number(id)) : null;

  const [title, setTitle] = useState(existing?.title || "");
  const [sections, setSections] = useState(
    existing?.sections || [{ id: 1, name: "unnamed section", marks: { correct: 2, wrong: 0.5 }, duration: 30, questions: [] }]
  );
  const [addingQuestionTo, setAddingQuestionTo] = useState(null);
  const [saved, setSaved] = useState(false);

  const addSection = () => setSections(prev => [...prev, { id: Math.max(...prev.map(s => s.id), 0) + 1, name: "unnamed section", marks: { correct: 2, wrong: 0.5 }, duration: 30, questions: [] }]);
  const updateSection = (sid, updated) => setSections(prev => prev.map(s => s.id === sid ? updated : s));
  const deleteSection = (sid) => setSections(prev => prev.filter(s => s.id !== sid));
  const addQuestion = (sectionId, question) => setSections(prev => prev.map(s => s.id === sectionId ? { ...s, questions: [...s.questions, { ...question, id: Date.now() }] } : s));
  const deleteQuestion = (sectionId, questionId) => setSections(prev => prev.map(s => s.id === sectionId ? { ...s, questions: s.questions.filter(q => q.id !== questionId) } : s));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Logo size={22} />
        <span className={styles.headerTitle}>Aspiro Mock Test Builder</span>
      </div>

      <div className={styles.content}>
        <div className={styles.titleBar}>
          <span className={styles.titleLabel}>MOCK TITLE :</span>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="unnamed mock" className={styles.titleInput} />
          <button onClick={handleSave} className={`${styles.saveBtn} ${saved ? styles.saveBtnSaved : ""}`}>
            {saved ? "SAVED ✓" : "SAVE MOCK"}
          </button>
        </div>

        <div className={styles.sectionsArea}>
          {sections.map((section, i) => (
            <SectionBlock
              key={section.id}
              section={section}
              index={i}
              onChange={updated => updateSection(section.id, updated)}
              onDelete={() => deleteSection(section.id)}
              onAddQuestion={sid => setAddingQuestionTo(sid)}
              onDeleteQuestion={deleteQuestion}
            />
          ))}
          <div className={styles.addSectionCard} onClick={addSection}>
            <span className={styles.addSectionIcon}>+</span>
            <div>
              <div className={styles.addSectionTitle}>ADD SECTION</div>
              <div className={styles.addSectionHint}>Create another section block on the list below</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.backArea}>
        <button onClick={() => navigate("/teacher")} className={styles.backBtn}>← Back to Dashboard</button>
      </div>

      {addingQuestionTo && (
        <QuestionModal
          onClose={() => setAddingQuestionTo(null)}
          onSave={q => addQuestion(addingQuestionTo, q)}
        />
      )}
    </div>
  );
}
