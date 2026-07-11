import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mocks, stats } from "../../mock/mockData";
import { useAuth } from "../../common/AuthContext";
import Logo from "../../common/Logo";
import styles from "./style.module.css";

function StatCard({ label, value }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{Number(value).toLocaleString()}</div>
    </div>
  );
}

function MockRow({ mock, onEdit, onDelete, onDuplicate }) {
  return (
    <div className={styles.mockRow}>
      <div className={styles.mockId}>{mock.id}</div>
      <div className={styles.mockInfo}>
        <div className={styles.mockTitle}>{mock.title}</div>
        <div className={styles.mockMeta}>
          <span>⏱</span>
          <span>at : {mock.startTime} - end {mock.endTime}</span>
        </div>
      </div>
      <div className={styles.mockStudents}>
        <span>👤</span>
        <span>{Number(mock.students).toLocaleString()}</span>
      </div>
      <div className={styles.actionBtns}>
        <button className={styles.actionBtn} title="Stats" onClick={() => {}}>📋</button>
        <button className={styles.actionBtn} title="Edit" onClick={() => onEdit(mock)}>✏️</button>
        <button className={styles.actionBtn} title="Duplicate" onClick={() => onDuplicate(mock)}>⧉</button>
        <button className={styles.actionBtn} title="Delete" onClick={() => onDelete(mock.id)}>🗑</button>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard" },
  { icon: "+", label: "Create Mock", tag: "ADD" },
  { icon: "💳", label: "Payments" },
  { icon: "👤", label: "Profile" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [mockList, setMockList] = useState(mocks);
  const [filter, setFilter] = useState("All Mocks");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };
  const handleDelete = (id) => setMockList(prev => prev.filter(m => m.id !== id));
  const handleDuplicate = (mock) => setMockList(prev => [...prev, { ...mock, id: Math.max(...prev.map(m => m.id)) + 1, title: mock.title + " (Copy)" }]);
  const handleEdit = (mock) => navigate(`/teacher/builder/${mock.id}`);

  const handleNavClick = (label) => {
    if (label === "Create Mock") { navigate("/teacher/builder/new"); setSidebarOpen(false); }
    else { setSidebarOpen(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
        <Logo size={22} />
        <span className={styles.headerTitle}>Aspiro Mocks Dashboard</span>
      </div>

      {sidebarOpen && (
        <div className={styles.overlay}>
          <div className={styles.overlayBg} onClick={() => setSidebarOpen(false)} />
          <div className={styles.sidebar}>
            <div className={styles.sidebarTop}>
              <span className={styles.sidebarPortalLabel}>ASPIRO PORTAL</span>
              <button className={styles.sidebarCloseBtn} onClick={() => setSidebarOpen(false)}>✕</button>
            </div>
            <div className={styles.sidebarBrand}>
              <Logo size={48} />
              <span className={styles.sidebarBrandName}>ASPIRO MOCKS</span>
            </div>
            <div className={styles.sidebarNav}>
              <div className={styles.sidebarSectionLabel}>NAVIGATION</div>
              {NAV_ITEMS.map(item => {
                const isActive = item.label === "Create Mock";
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.label)}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  >
                    <span className={isActive ? styles.navIconActive : styles.navIcon}>{item.icon}</span>
                    <span className={`${styles.navLabel} ${isActive ? styles.navLabelActive : ""}`}>{item.label}</span>
                    {item.tag ? <span className={styles.navTag}>{item.tag}</span> : <span className={styles.navChevron}>›</span>}
                  </button>
                );
              })}
              <div className={styles.sidebarSectionLabelStore}>STORE</div>
              <button className={styles.storeBtn}>
                <span className={styles.storeBtnIcon}>◇</span>
                <span className={styles.storeBtnLabel}>Add mock packs for later use</span>
              </button>

              <div className={styles.userSection}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>{currentUser?.name?.[0] || "T"}</div>
                  <div>
                    <div className={styles.userName}>{currentUser?.name}</div>
                    <div className={styles.userEmail}>{currentUser?.email}</div>
                  </div>
                </div>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  <span>🚪</span>
                  <span className={styles.logoutLabel}>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.statsRow}>
          <StatCard label="Active Mocks" value={stats.activeMocks} />
          <div className={styles.statDivider} />
          <StatCard label="Total Students Attempted" value={stats.totalStudentsAttempted} />
          <div className={styles.statDivider} />
          <StatCard label="Total Registrations" value={stats.totalRegistrations} />
          <div className={styles.statDivider} />
          <StatCard label="Total Mocks Built" value={stats.totalMocksBuilt} />
        </div>

        <div className={styles.mockListCard}>
          <div className={styles.mockListHeader}>
            <span className={styles.mockListTitle}>Created Mocks</span>
            <div className={styles.filterWrap}>
              <span>⊞ Filter:</span>
              <select value={filter} onChange={e => setFilter(e.target.value)} className={styles.filterSelect}>
                <option>All Mocks</option>
                <option>Active</option>
                <option>Ended</option>
              </select>
            </div>
            <button onClick={() => navigate("/teacher/builder/new")} className={styles.addBtn}>
              + add new
            </button>
          </div>
          {mockList.map(mock => (
            <MockRow key={mock.id} mock={mock} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
          ))}
          {mockList.length === 0 && (
            <div className={styles.emptyState}>No mocks yet. Click "+ add new" to create one.</div>
          )}
        </div>
      </div>
    </div>
  );
}
