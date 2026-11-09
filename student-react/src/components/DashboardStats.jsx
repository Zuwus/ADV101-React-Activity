const statDetails = [
  { key: "total", label: "Total courses", note: "In your dashboard", icon: "▤", tone: "blue" },
  { key: "active", label: "Active courses", note: "Currently in progress", icon: "◷", tone: "violet" },
  { key: "completed", label: "Completed", note: "Successfully finished", icon: "✓", tone: "green" },
];

export default function DashboardStats({ courses }) {
  const completed = courses.filter((course) => course.completed).length;
  const stats = { total: courses.length, active: courses.length - completed, completed };

  return (
    <section className="stats" aria-label="Course statistics">
      {statDetails.map((stat) => (
        <article className="stat-card" key={stat.key}>
          <div className={`stat-icon ${stat.tone}`} aria-hidden="true">{stat.icon}</div>
          <div className="stat-copy">
            <span>{stat.label}</span>
            <strong>{stats[stat.key]}</strong>
            <small>{stat.note}</small>
          </div>
        </article>
      ))}
    </section>
  );
}
