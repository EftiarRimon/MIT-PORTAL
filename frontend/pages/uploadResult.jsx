import { useState } from "react";
import axios from "axios";

const courses = {
  "MITM 303": "Advanced Computer Networks & Internetworking",
  "MITM 304": "Database Architecture and Administration",
  "MITM 310": "Advanced Data Structures and Algorithms",
  "MITM 311": "Advanced Object-Oriented Programming",
  "MITM 301": "IT Project Management",
  "MITM 305": "Web Technology and Internet Computing",
  "MITM 421": "Project for MIT/Internship",
  "MITE 436": "Artificial Intelligence",
  "MITE 430": "Machine Learning",
  "MITE 437": "Data Mining",
  "MITE 431": "Big Data Analytic",
  "MITE 432": "Cryptography and Security Mechanisms",
  "MITE 442": "Network Security",
  "MITE 438": "Secured Software System",
  "MITE 433": "Cyber Security",
  "MITE 434": "Software Quality Assurance and Testing",
  "MITE 439": "Software Requirements Engineering and Design",
  "MITE 435": "Software Maintenance and Analytics",
  "MITE 441": "Software Design Pattern",
};

export default function UploadResult() {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [session, setSession] = useState("");
  const [file, setFile] = useState(null);

  const handleCourseCodeChange = (e) => {
    const selectedCourseCode = e.target.value;
    setCourseCode(selectedCourseCode);
    setCourseName(courses[selectedCourseCode] || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const formData = new FormData();
    formData.append("courseCode", courseCode);
    formData.append("courseName", courseName);
    formData.append("semester", semester);
    formData.append("session", session);
    formData.append("file", file);

    console.log("FormData prepared", formData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response received", response.data);
      alert(response.data);
    } catch (error) {
      console.error(
        "Error uploading data:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Upload failed: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Result</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Course Code:</label>
          <select
            value={courseCode}
            onChange={handleCourseCodeChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Select a course code</option>
            {Object.keys(courses).map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            value={courseName}
            readOnly
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Semester:</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select a semester</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
          </select>
        </div>
        <div>
          <label>Session:</label>
          <input
            type="text"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="border p-2 w-full"
            placeholder="20XX-XX"
            required
          />
        </div>
        <div>
          <label>Excel File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Upload Result
        </button>
      </form>
    </div>
  );
}
