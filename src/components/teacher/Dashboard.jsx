import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mocks, stats } from "../../data/mockData";
import Logo from "../shared/Logo";

function StatCard({ label, value }) {
  return (
    <div style={{ flex: 1, padding: "20px 24px" }}>
      <div style={{ fontSize: 11, color: "#888", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111", letterSpacing: "-0.5px" }}>
        {Number(value).toLocaleString()}
      </div>
    </div>
  );
}

function MockRow({ mock, onEdit, onDelete, onDuplicate }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "18px 20px",
      borderBottom: "1px solid #f0f0f0", gap: 16,
    }}>
      <div style={{ width: 32, color: "#bbb", fontSize: 13, fontWeight: 600 }}>{mock.id}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#111", marginBottom: 4 }}>{mock.title}</div>
        <div style={{ fontSize: 12, color: "#888", display: "flex", gap: 6, alignItems: "center" }}>
          <span>⏱</span>
          <span>at : {mock.startTime} - end {mock.endTime}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13, marginRight: 8 }}>
        <span style={{ fontSize: 14 }}>👤</span>
        <span style={{ fontWeight: 600 }}>{Number(mock.students).toLocaleString()}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn icon="📋" title="Stats" onClick={() => {}} color="#6b7280" />
        <ActionBtn icon="✏️" title="Edit" onClick={() => onEdit(mock)} color="#3b82f6" />
        <ActionBtn icon="⧉" title="Duplicate" onClick={() => onDuplicate(mock)} color="#6b7280" />
        <ActionBtn icon="🗑" title="Delete" onClick={() => onDelete(mock.id)} color="#ef4444" />
      </div>
    </div>
  );
}

function ActionBtn({ icon, title, onClick, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#f5f5f5" : "transparent",
        border: "none", borderRadius: 6,
        width: 30, height: 30, cursor: "pointer",
        fontSize: 14, display: "flex", alignItems: "center",
        justifyContent: "center", transition: "background 0.15s",
      }}
    >
      {icon}
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [mockList, setMockList] = useState(mocks);
  const [filter, setFilter] = useState("All Mocks");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDelete = (id) => setMockList((prev) => prev.filter((m) => m.id !== id));
  const handleDuplicate = (mock) => setMockList((prev) => [...prev, { ...mock, id: Math.max(...prev.map(m => m.id)) + 1, title: mock.title + " (Copy)" }]);
  const handleEdit = (mock) => navigate(`/teacher/builder/${mock.id}`);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #eee",
        padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 14,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#555", padding: 4 }}>☰</button>
        <Logo size={22} />
        <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>Aspiro Mocks Dashboard</span>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div onClick={() => setSidebarOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
          <div style={{
            position: "relative", zIndex: 10, background: "#fff",
            width: 280, height: "100%", padding: "24px 0", display: "flex", flexDirection: "column",
          }}>
            <div style={{ padding: "0 24px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.1em" }}>ASPIRO PORTAL</span>
              <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#888" }}>✕</button>
            </div>
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, borderBottom: "1px solid #eee", marginBottom: 16 }}>
              <Logo size={48} />
              <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "0.1em" }}>ASPIRO MOCKS</span>
            </div>
            <div style={{ padding: "0 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.1em", padding: "8px 8px 4px" }}>NAVIGATION</div>
              {[
                { icon: "⊞", label: "Dashboard", action: () => { setSidebarOpen(false); } },
                { icon: "+", label: "Create Mock", tag: "ADD", action: () => { navigate("/teacher/builder/new"); setSidebarOpen(false); } },
                { icon: "💳", label: "Payments", action: () => {} },
                { icon: "👤", label: "Profile", action: () => {} },
              ].map((item) => (
                <button key={item.label} onClick={item.action} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 8px", background: item.label === "Create Mock" ? "#eff6ff" : "none",
                  border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 2,
                }}>
                  <span style={{ fontSize: 16, color: item.label === "Create Mock" ? "#3b82f6" : "#555" }}>{item.icon}</span>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 14, color: item.label === "Create Mock" ? "#3b82f6" : "#222" }}>{item.label}</span>
                  {item.tag && <span style={{ background: "#e5e7eb", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>{item.tag}</span>}
                  {!item.tag && <span style={{ color: "#bbb" }}>›</span>}
                </button>
              ))}
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.1em", padding: "16px 8px 4px" }}>STORE</div>
              <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ color: "#3b82f6" }}>◇</span>
                <span style={{ fontWeight: 500, fontSize: 14, color: "#222" }}>Add mock packs for later use</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
        {/* Stats */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", display: "flex", marginBottom: 24, overflow: "hidden" }}>
          <StatCard label="Active Mocks" value={stats.activeMocks} />
          <div style={{ width: 1, background: "#f0f0f0" }} />
          <StatCard label="Total Students Attempted" value={stats.totalStudentsAttempted} />
          <div style={{ width: 1, background: "#f0f0f0" }} />
          <StatCard label="Total Registrations" value={stats.totalRegistrations} />
          <div style={{ width: 1, background: "#f0f0f0" }} />
          <StatCard label="Total Mocks Built" value={stats.totalMocksBuilt} />
        </div>

        {/* Mock List */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#111", flex: 1 }}>Created Mocks</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 12, background: "#f5f5f5", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: "#555" }}>
              <span>⊞ Filter:</span>
              <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: "none", border: "none", fontSize: 13, color: "#555", cursor: "pointer", outline: "none" }}>
                <option>All Mocks</option>
                <option>Active</option>
                <option>Ended</option>
              </select>
            </div>
            <button
              onClick={() => navigate("/teacher/builder/new")}
              style={{
                background: "#111", color: "#fff", border: "none", borderRadius: 8,
                padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              + add new
            </button>
          </div>
          {mockList.map((mock) => (
            <MockRow key={mock.id} mock={mock} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
          ))}
          {mockList.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", color: "#aaa", fontSize: 14 }}>
              No mocks yet. Click "+ add new" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
