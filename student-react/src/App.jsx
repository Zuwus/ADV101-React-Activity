import { useEffect, useState } from "react";
import CourseCard from "./components/CourseCard.jsx";
import CourseForm from "./components/CourseForm.jsx";
import DashboardStats from "./components/DashboardStats.jsx";

const STORAGE_KEY = "student-courses";
const THEME_STORAGE_KEY = "student-dashboard-theme";

const initialCourses = [
  { id: "course-1", code: "ICT 105", title: "Web Development", completed: false },
  { id: "course-2", code: "ICT 101", title: "Introduction to Computing", completed: true },
  { id: "course-3", code: "LIS 112", title: "Systems Analysis", completed: false },
];

function isCourseList(value) {
  return Array.isArray(value) && value.every((course) => (
    course && typeof course === "object" &&
    typeof course.id === "string" && course.id.length > 0 &&
    typeof course.code === "string" && typeof course.title === "string" &&
    typeof course.completed === "boolean"
  ));
}

function loadCourses() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === null) return initialCourses;
    const parsed = JSON.parse(saved);
    return isCourseList(parsed) ? parsed : initialCourses;
  } catch {
    return initialCourses;
  }
}

function createCourseId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `course-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [courses, setCourses] = useState(loadCourses);
  const [search, setSearch] = useState("");
  const [storageNotice, setStorageNotice] = useState("");
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
      setStorageNotice("");
    } catch {
      setStorageNotice("Your browser could not save changes. They may not remain after you close this page.");
    }
  }, [courses]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Keep theme switching available when browser storage is disabled.
    }
  }, [theme]);

  const keyword = search.trim().toLocaleLowerCase();
  const filteredCourses = courses.filter((course) => (
    course.code.toLocaleLowerCase().includes(keyword) ||
    course.title.toLocaleLowerCase().includes(keyword)
  ));

  function addCourse(newCourse) {
    if (courses.some((course) => course.code.trim().toLocaleLowerCase() === newCourse.code.trim().toLocaleLowerCase())) {
      return false;
    }
    setCourses((current) => [
      ...current,
      { id: createCourseId(), ...newCourse, completed: false },
    ]);
    return true;
  }

  function toggleCourse(id) {
    setCourses((current) => current.map((course) => (
      course.id === id ? { ...course, completed: !course.completed } : course
    )));
  }

  function deleteCourse(id) {
    setCourses((current) => current.filter((course) => course.id !== id));
  }

  return (
    <main className="dashboard" data-theme={theme}>
      <header className="dashboard-header">
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.6 8.6 0 1 0 20.2 15.2Z" />
            </svg>
          )}
        </button>
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32"><path d="M4 11.5 16 5l12 6.5L16 18 4 11.5Zm4.5 3.2V21c4.8 3.5 8.2 3.5 13 0v-6.3M28 12v8" /></svg>
          </div>
          <span>STUDENT PORTAL</span>
          <span className="brand-divider" aria-hidden="true">/</span>
          <span className="brand-muted">ACADEMIC OVERVIEW</span>
        </div>
        <div className="header-content">
          <div>
            <p className="eyebrow">YOUR LEARNING, AT A GLANCE</p>
            <h1>Student Academic Dashboard</h1>
            <p className="header-subtitle">Keep your courses organized and track your progress throughout the term.</p>
          </div>
          <div className="term-chip"><span className="term-dot" />Course overview</div>
        </div>
      </header>

      <DashboardStats courses={courses} />

      <div className="content-grid">
        <CourseForm onAddCourse={addCourse} />

        <section className="panel courses-panel" aria-labelledby="courses-heading">
          <div className="courses-heading-row">
            <div>
              <p className="section-kicker">YOUR STUDY PLAN</p>
              <h2 id="courses-heading">My courses <span className="course-count">{courses.length}</span></h2>
            </div>
            <label className="search-box">
              <span className="sr-only">Search courses</span>
              <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.8" /><path d="m13 13 4 4" /></svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses..."
              />
            </label>
          </div>

          <div className="course-list" aria-live="polite">
            {filteredCourses.length > 0 ? filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onToggle={toggleCourse}
                onDelete={deleteCourse}
              />
            )) : (
              <div className="empty-state">
                <span className="empty-icon" aria-hidden="true">⌕</span>
                <h3>{courses.length ? "No matching courses" : "No courses yet"}</h3>
                <p>{courses.length ? "Try another course code or title." : "Add a course above to start your study plan."}</p>
              </div>
            )}
          </div>
          {storageNotice && <p className="storage-notice" role="status">{storageNotice}</p>}
        </section>
      </div>

      <footer className="dashboard-footer">
        <span>Academic progress, made simple.</span>
        <span>Changes are saved in this browser</span>
      </footer>
    </main>
  );
}
