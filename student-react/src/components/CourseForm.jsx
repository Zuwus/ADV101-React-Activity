import { useState } from "react";

export default function CourseForm({ onAddCourse }) {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  function submit(event) {
    event.preventDefault();
    const trimmedCode = code.trim();
    const trimmedTitle = title.trim();

    if (!trimmedCode || !trimmedTitle) {
      setMessageType("error");
      setMessage("Please complete both fields.");
      return;
    }

    const added = onAddCourse({ code: trimmedCode, title: trimmedTitle });
    if (!added) {
      setMessageType("error");
      setMessage("That course code already exists. Try a different code.");
      return;
    }

    setCode("");
    setTitle("");
    setMessageType("success");
    setMessage("Course added successfully.");
  }

  function clearMessage() {
    if (message) setMessage("");
  }

  return (
    <section className="panel form-panel" aria-labelledby="add-course-heading">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">COURSE REGISTRATION</p>
          <h2 id="add-course-heading">Add a course</h2>
        </div>
        <span className="heading-icon" aria-hidden="true">＋</span>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label className="field">
            <span>Course code</span>
            <input
              value={code}
              onChange={(event) => { setCode(event.target.value); clearMessage(); }}
              placeholder="e.g. ICT 110"
              autoComplete="off"
              required
            />
          </label>
          <label className="field">
            <span>Course title</span>
            <input
              value={title}
              onChange={(event) => { setTitle(event.target.value); clearMessage(); }}
              placeholder="Course descriptive title"
              autoComplete="off"
              required
            />
          </label>
          <button className="button button-primary add-button" type="submit">
            <span aria-hidden="true">＋</span> Add course
          </button>
        </div>
      </form>
      {message && (
        <p className={`form-message ${messageType}`} role="status">
          {messageType === "success" ? "✓" : "!"} {message}
        </p>
      )}
    </section>
  );
}
