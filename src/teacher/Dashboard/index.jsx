import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mocks, stats } from "../../mock/mockData";
import { useAuth } from "../../common/AuthContext";
import Logo from "../../common/Logo";
import styles from "./style.module.css";

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconFilter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

function parseMockDate(str) {
  if (!str) return null;
  const [timePart, datePart] = str.split(" ");
  const [hh, mm] = timePart.split(":");
  const [dd, mo, yyyy] = datePart.split("-");
  return new Date(`${yyyy}-${mo}-${dd}T${hh}:${mm}:00`);
}

function isLive(mock) {
  const now = new Date();
  const start = parseMockDate(mock.startTime);
  const end = parseMockDate(mock.endTime);
  return start && end && now >= start && now <= end;
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: "⊞" },
  { label: "Create Mock", icon: "+", tag: "ADD" },
  { label: "Payments", icon: "💳" },
  { label: "Profile", icon: "👤" },
];

function StatCard({ label, value }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{Number(value).toLocaleString()}</div>
    </div>
  );
}

function MockRow({ mock, onEdit, onDelete, onDuplicate }) {
  const live = isLive(mock);
  return (
    <div className={styles.mockRow}>
      <div className={styles.mockId}>{mock.id}</div>
      <div className={styles.mockInfo}>
        <div className={styles.mockTitleRow}>
          <span className={styles.mockTitle}>{mock.title}</span>
          {live ? (
            <span className={styles.badgeLive}>LIVE</span>
          ) : (
            <span className={styles.badgeEnded}>ENDED</span>
          )}
        </div>
        <div className={styles.mockMeta}>
          <IconCalendar />
          <span>st : {mock.startTime} &nbsp;–&nbsp; end {mock.endTime}</span>
        </div>
      </div>
      <div className={styles.mockStudents}>
        <IconUsers />
        <span>{Number(mock.students).toLocaleString()}</span>
      </div>
      {live ? (
        <button className={styles.stopLiveBtn}>STOP LIVE</button>
      ) : (
        <button className={styles.goLiveBtn}>GO LIVE</button>
      )}
      <div className={styles.actionBtns}>
        <button className={styles.actionBtn} title="Edit" onClick={() => onEdit(mock)}><IconEdit /></button>
        <button className={styles.actionBtn} title="Duplicate" onClick={() => onDuplicate(mock)}><IconCopy /></button>
        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} title="Delete" onClick={() => onDelete(mock.id)}><IconTrash /></button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [mockList, setMockList] = useState(mocks);
  const [filter, setFilter] = useState("All Mocks");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };
  const handleDelete = (id) => setMockList(prev => prev.filter(m => m.id !== id));
  const handleDuplicate = (mock) => setMockList(prev => [
    ...prev,
    { ...mock, id: Math.max(...prev.map(m => m.id)) + 1, title: mock.title + " (Copy)" },
  ]);
  const handleEdit = (mock) => navigate(`/teacher/builder/${mock.id}`);
  const handleNavClick = (label) => {
    if (label === "Create Mock") navigate("/teacher/builder/new");
    setSidebarOpen(false);
  };

  const filtered = mockList.filter(m => {
    if (filter === "Active") return isLive(m);
    if (filter === "Ended") return !isLive(m);
    return true;
  });

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}><IconMenu /></button>
        <Logo size={22} />
        <span className={styles.headerTitle}>My Dashboard</span>
      </div>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div className={styles.overlay}>
          <div className={styles.overlayBg} onClick={() => setSidebarOpen(false)} />
          <div className={styles.sidebar}>
            <div className={styles.sidebarTop}>
              <span className={styles.sidebarPortalLabel}>ASPIRO PORTAL</span>
              <button className={styles.sidebarCloseBtn} onClick={() => setSidebarOpen(false)}>✕</button>
            </div>
            <div className={styles.sidebarBrand}>
              <Logo size={44} />
              <span className={styles.sidebarBrandName}>ASPIRO MOCKS</span>
            </div>
            <div className={styles.sidebarNav}>
              <div className={styles.sidebarSectionLabel}>NAVIGATION</div>
              {NAV_ITEMS.map(item => (
                <button key={item.label} onClick={() => handleNavClick(item.label)}
                  className={`${styles.navItem} ${item.label === "Create Mock" ? styles.navItemActive : ""}`}>
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.tag
                    ? <span className={styles.navTag}>{item.tag}</span>
                    : <span className={styles.navChevron}>›</span>}
                </button>
              ))}
              <div className={styles.sidebarSectionLabel} style={{ marginTop: 12 }}>STORE</div>
              <button className={styles.storeBtn}>
                <span>◇</span>
                <span>Add mock packs for later use</span>
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
                  <IconLogout />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className={styles.content}>
        {/* STATS */}
        <div className={styles.statsRow}>
          <StatCard label="ACTIVE MOCKS" value={stats.activeMocks} />
          <div className={styles.statDivider} />
          <StatCard label="TOTAL STUDENTS ATTEMPTED" value={stats.totalStudentsAttempted} />
          <div className={styles.statDivider} />
          <StatCard label="TOTAL REGISTRATIONS" value={stats.totalRegistrations} />
          <div className={styles.statDivider} />
          <StatCard label="TOTAL MOCKS BUILT" value={stats.totalMocksBuilt} />
        </div>

        {/* MOCK LIST */}
        <div className={styles.mockListCard}>
          <div className={styles.mockListHeader}>
            <span className={styles.mockListTitle}>created mocks</span>
            <div className={styles.filterWrap}>
              <IconFilter />
              <span>Filter:</span>
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

          {filtered.map(mock => (
            <MockRow key={mock.id} mock={mock} onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate} />
          ))}
          {filtered.length === 0 && (
            <div className={styles.emptyState}>No mocks found. Click "+ add new" to create one.</div>
          )}
        </div>
      </div>
    </div>
  );
}
