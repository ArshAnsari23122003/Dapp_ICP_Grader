import React, { useState, useEffect } from "react";
import { crud_app_backend } from "declarations/crud_app_backend";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [numSubjects, setNumSubjects] = useState(0);
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [maxMark, setMaxMark] = useState("");
  const [students, setStudents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filteredStudent, setFilteredStudent] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const handleMarksChange = (index, value) => {
    const updatedMarks = [...subjectMarks];
    updatedMarks[index] = Number(value);
    setSubjectMarks(updatedMarks);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const addStudent = async () => {
    if (!name || subjectMarks.length !== Number(numSubjects) || !maxMark) {
      alert("Please fill all fields!");
      return;
    }
    await crud_app_backend.add_student(name, subjectMarks, parseInt(maxMark));
    showToast("🎉 Student added successfully!");
    setName("");
    setNumSubjects(0);
    setSubjectMarks([]);
    setMaxMark("");
    loadStudents();
  };

  const deleteStudent = async (name) => {
    await crud_app_backend.delete_student(name);
    showToast(`🗑️ Deleted ${name}`);
    loadStudents();
  };

  const loadStudents = async () => {
    const list = await crud_app_backend.list_students();
    setStudents(list);
    setFilteredStudent(null); // reset search view
  };

  const searchStudent = async () => {
    const res = await crud_app_backend.get_student(searchName);
    setFilteredStudent(res[0]);
  };

  const getGradeStats = () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    students.forEach((s) => {
      const total = s.marks.reduce((a, b) => a + b, 0);
      const percentage = (total / (s.max_mark * s.marks.length)) * 100;
      if (percentage >= 90) counts.A++;
      else if (percentage >= 75) counts.B++;
      else if (percentage >= 60) counts.C++;
      else counts.D++;
    });
    return counts;
  };

  const getSortedStudents = () => {
    return [...students].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "grade") {
        const getGrade = (s) => {
          const p = s.marks.reduce((a, b) => a + b, 0) / (s.max_mark * s.marks.length) * 100;
          if (p >= 90) return "A";
          else if (p >= 75) return "B";
          else if (p >= 60) return "C";
          else return "D";
        };
        return getGrade(a).localeCompare(getGrade(b));
      }
    });
  };

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <div className="header">
        <h2>📘 Student Manager</h2>
        <label className="switch">
          <input type="checkbox" onChange={() => setDarkMode(!darkMode)} />
          <span className="slider round"></span>
        </label>
      </div>

      <input className="input" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        className="input"
        placeholder="Number of Subjects"
        type="number"
        value={numSubjects}
        onChange={(e) => {
          setNumSubjects(e.target.value);
          setSubjectMarks(Array(Number(e.target.value)).fill(""));
        }}
      />

      {subjectMarks.map((_, i) => (
        <input
          className="input"
          key={i}
          placeholder={`Marks for Subject ${i + 1}`}
          type="number"
          value={subjectMarks[i]}
          onChange={(e) => handleMarksChange(i, e.target.value)}
        />
      ))}

      <input className="input" placeholder="Max Marks per Subject" type="number" value={maxMark} onChange={(e) => setMaxMark(e.target.value)} />

      <div className="button-group">
        <button onClick={addStudent} className={`btn ${darkMode ? "dark" : "light"}`}>➕ Add Student</button>
        <button onClick={loadStudents} className={`btn ${darkMode ? "dark" : "light"}`}>📋 Show Students</button>
      </div>

      <hr />

      <div style={{ marginBottom: "10px" }}>
        <input
          className="input"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={searchStudent} className={`btn ${darkMode ? "dark" : "light"}`} style={{ marginTop: "8px" }}>
          🔍 Search
        </button>
      </div>

      {filteredStudent && (
        <div className="student-list">
          <strong>{filteredStudent.name}</strong> → Avg: {(
            filteredStudent.marks.reduce((a, b) => a + b, 0) /
            (filteredStudent.marks.length * filteredStudent.max_mark) *
            100
          ).toFixed(2)}%
        </div>
      )}

      <div>
        <label>Sort by: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
          <option value="name">Name</option>
          <option value="grade">Grade</option>
        </select>
      </div>

      <ul className="student-list">
        {getSortedStudents().map((s, i) => {
          const total = s.marks.reduce((a, b) => a + b, 0);
          const percentage = (total / (s.max_mark * s.marks.length)) * 100;

          let grade = "";
          let gradeColor = "";

          if (percentage >= 90) { grade = "A"; gradeColor = "green"; }
          else if (percentage >= 75) { grade = "B"; gradeColor = "blue"; }
          else if (percentage >= 60) { grade = "C"; gradeColor = "orange"; }
          else { grade = "D"; gradeColor = "red"; }

          return (
            <li key={i}>
              <strong>{s.name}</strong> → Avg: {percentage.toFixed(2)}% → <span className={`grade ${gradeColor}`}>Grade: {grade}</span>
              <button onClick={() => deleteStudent(s.name)} style={{ marginLeft: "10px", padding: "4px 8px", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>❌</button>
            </li>
          );
        })}
      </ul>

      <div className="stats">
        <h4>📊 Grade Stats:</h4>
        {Object.entries(getGradeStats()).map(([grade, count]) => (
          <div key={grade}>Grade {grade}: {count} student(s)</div>
        ))}
      </div>

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}

export default App;
