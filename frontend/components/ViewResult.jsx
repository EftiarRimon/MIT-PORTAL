import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ViewResult() {
  const [semester, setSemester] = useState("");
  const [session, setSession] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("Sending request to backend");
      const response = await axios.post(
        "http://localhost:5000/api/view-result",
        {
          semester,
          session,
          rollNumber,
        }
      );
      console.log("Received response from backend:", response.data);
      setResult(response.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    }
  };

  const calculateCGPA = (results) => {
    if (!results || results.length === 0) return 0;

    const totalGPA = results.reduce((acc, curr) => acc + curr.gpa, 0);
    return (totalGPA / results.length).toFixed(2);
  };

  const downloadPDF = async () => {
    const marksheetElement = document.getElementById("marksheet");

    const canvas = await html2canvas(marksheetElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`marksheet_${semester}_semester.pdf`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">View Result</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Semester:</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Semester</option>
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
          <label>Roll Number:</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          View Result
        </button>
      </form>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {result && (
        <div className="mt-4">
          {result.results.length === 0 ? (
            <p className="text-red-500">
              Roll number is not given exam in this semester.
            </p>
          ) : (
            <>
              <div
                id="marksheet"
                className="p-6 rounded-lg shadow-lg"
                style={{ backgroundColor: "#F5F5DC" }}
              >
                <h2 className="text-xl font-bold mb-4 text-center">
                  Marksheet of {semester} Semester
                </h2>
                <div className="border p-4 rounded-lg mb-4 shadow-md">
                  <table className="min-w-full bg-white border-collapse">
                    <tbody>
                      <tr>
                        <td
                          className="border font-bold px-4 py-2"
                          style={{ width: "30%", backgroundColor: "#f3f3f3" }}
                        >
                          Name:
                        </td>
                        <td
                          className="border px-4 py-2"
                          style={{ width: "70%", backgroundColor: "#fafafa" }}
                        >
                          {result.student.name}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="border font-bold px-4 py-2"
                          style={{ width: "30%", backgroundColor: "#f3f3f3" }}
                        >
                          Roll Number:
                        </td>
                        <td
                          className="border px-4 py-2"
                          style={{ width: "70%", backgroundColor: "#fafafa" }}
                        >
                          {result.student.registration_number}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="border font-bold px-4 py-2"
                          style={{ width: "30%", backgroundColor: "#f3f3f3" }}
                        >
                          Email:
                        </td>
                        <td
                          className="border px-4 py-2"
                          style={{ width: "70%", backgroundColor: "#fafafa" }}
                        >
                          {result.student.email}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <table className="min-w-full bg-white border-collapse shadow-md rounded-lg">
                  <thead>
                    <tr style={{ backgroundColor: "#f0e5d8" }}>
                      <th className="py-3 px-4 border font-semibold text-left">
                        Course Code
                      </th>
                      <th className="py-3 px-4 border font-semibold text-left">
                        Course Name
                      </th>
                      <th className="py-3 px-4 border font-semibold text-left">
                        GPA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.results.map((row, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#fafafa" : "#f5f5f5",
                        }}
                      >
                        <td className="border px-4 py-2">{row.course_code}</td>
                        <td className="border px-4 py-2">{row.course_name}</td>
                        <td className="border px-4 py-2">{row.gpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 font-bold text-lg">
                  CGPA: {calculateCGPA(result.results)}
                </div>
              </div>
              <button
                onClick={downloadPDF}
                className="bg-green-500 text-white p-3 rounded mt-4 shadow-md hover:bg-green-600"
              >
                Download as PDF
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
