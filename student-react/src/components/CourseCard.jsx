export default function CourseCard({ course, onToggle, onDelete }) {
  return (
    <article className={`course-card${course.completed ? " is-completed" : ""}`}>
      <div className="course-mark" aria-hidden="true">
        {course.code.slice(0, 1)}
      </div>
      <div className="course-info">
        <div className="course-title-row">
          <h3>{course.title}</h3>
          <span className={`status ${course.completed ? "completed" : "active"}`}>
            <span className="status-dot" aria-hidden="true" />
            {course.completed ? "Completed" : "Active"}
          </span>
        </div>
        <p className="course-code">{course.code}</p>
      </div>
      <div className="card-actions">
        <button
          className="button button-secondary"
          type="button"
          onClick={() => onToggle(course.id)}
          aria-label={`Mark ${course.title} ${course.completed ? "active" : "completed"}`}
        >
          {course.completed ? "Mark Active" : "Complete"}
        </button>
        <button
          className="button button-icon button-danger"
          type="button"
          onClick={() => onDelete(course.id)}
          aria-label={`Delete ${course.title}`}
          title="Delete course"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4.5 6h11M8 6V4.5h4V6m-6.5 0 .7 9.2h5.6l.7-9.2M8.2 8.5v4.5m3.6-4.5v4.5" />
          </svg>
        </button>
      </div>
    </article>
  );
}
