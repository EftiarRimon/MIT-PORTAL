import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ViewResult() {
  const [rollNumber, setRollNumber] = useState("");
  const [session, setSession] = useState("");
  const [currentSemester, setCurrentSemester] = useState("");
  const [activeTab, setActiveTab] = useState("latest"); // "latest" | "overall"
  const [latestResult, setLatestResult] = useState(null);
  const [overallResult, setOverallResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-fill roll, session, currentSemester from token
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/student-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRollNumber(response.data.registration_number);
        setSession(response.data.session);
        setCurrentSemester(response.data.currentSemester || "");
      } catch (error) {
        console.error("Error fetching student info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, []);

  const fetchLatestResult = async () => {
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/api/view-result", {
        semester: currentSemester,
        session,
        rollNumber,
      });
      setLatestResult(response.data);
    } catch (err) {
      setError("Failed to fetch result.");
      console.error(err);
    }
  };

  const fetchOverallResult = async () => {
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/api/view-result-all", {
        session,
        rollNumber,
      });
      setOverallResult(response.data);
    } catch (err) {
      setError("Failed to fetch overall result.");
      console.error(err);
    }
  };

  const handleFetch = () => {
    if (activeTab === "latest") fetchLatestResult();
    else fetchOverallResult();
  };

  const calculateCGPA = (results) => {
    if (!results || results.length === 0) return 0;
    const totalGPA = results.reduce((acc, curr) => acc + curr.gpa, 0);
    return (totalGPA / results.length).toFixed(2);
  };

  const downloadPDF = async (elementId, filename) => {
    const el = document.getElementById(elementId);
    const canvas = await html2canvas(el);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">View Result</h1>

      {/* Auto-filled info — read only */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Roll Number</label>
          <p className="font-semibold text-gray-800">{rollNumber}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Session</label>
          <p className="font-semibold text-gray-800">{session}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Current Semester</label>
          <p className="font-semibold text-gray-800">{currentSemester}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab("latest"); setLatestResult(null); setOverallResult(null); setError(null); }}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${
            activeTab === "latest"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Latest Semester Result
        </button>
        <button
          onClick={() => { setActiveTab("overall"); setLatestResult(null); setOverallResult(null); setError(null); }}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${
            activeTab === "overall"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Overall Result
        </button>
      </div>

      <button
        onClick={handleFetch}
        className="bg-blue-500 text-white px-6 py-2 rounded mb-6"
      >
        {activeTab === "latest" ? "View Latest Result" : "View Overall Result"}
      </button>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Latest Semester Result */}
      {activeTab === "latest" && latestResult && (
        <div>
          {latestResult.results.length === 0 ? (
            <p className="text-red-500">No result found for this semester.</p>
          ) : (
            <>
              <div id="marksheet-latest" className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#F5F5DC" }}>
                <h2 className="text-xl font-bold mb-4 text-center">
                  Marksheet of {currentSemester} Semester
                </h2>
                <div className="border p-4 rounded-lg mb-4 shadow-md">
                  <table className="min-w-full bg-white border-collapse">
                    <tbody>
                      <tr>
                        <td className="border font-bold px-4 py-2" style={{ width: "30%", backgroundColor: "#f3f3f3" }}>Name:</td>
                        <td className="border px-4 py-2" style={{ backgroundColor: "#fafafa" }}>{latestResult.student.name}</td>
                      </tr>
                      <tr>
                        <td className="border font-bold px-4 py-2" style={{ backgroundColor: "#f3f3f3" }}>Roll Number:</td>
                        <td className="border px-4 py-2" style={{ backgroundColor: "#fafafa" }}>{latestResult.student.registration_number}</td>
                      </tr>
                      <tr>
                        <td className="border font-bold px-4 py-2" style={{ backgroundColor: "#f3f3f3" }}>Email:</td>
                        <td className="border px-4 py-2" style={{ backgroundColor: "#fafafa" }}>{latestResult.student.email}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <table className="min-w-full bg-white border-collapse shadow-md rounded-lg">
                  <thead>
                    <tr style={{ backgroundColor: "#f0e5d8" }}>
                      <th className="py-3 px-4 border font-semibold text-left">Course Code</th>
                      <th className="py-3 px-4 border font-semibold text-left">Course Name</th>
                      <th className="py-3 px-4 border font-semibold text-left">GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestResult.results.map((row, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#fafafa" : "#f5f5f5" }}>
                        <td className="border px-4 py-2">{row.course_code}</td>
                        <td className="border px-4 py-2">{row.course_name}</td>
                        <td className="border px-4 py-2">{row.gpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 font-bold text-lg">
                  CGPA: {calculateCGPA(latestResult.results)}
                </div>
              </div>
              <button
                onClick={() => downloadPDF("marksheet-latest", `marksheet_${currentSemester}_semester.pdf`)}
                className="bg-green-500 text-white p-3 rounded mt-4 shadow-md hover:bg-green-600"
              >
                Download as PDF
              </button>
            </>
          )}
        </div>
      )}

      {/* Overall Result */}
      {activeTab === "overall" && overallResult && (
        <div>
          {overallResult.semesters?.length === 0 ? (
            <p className="text-red-500">No result found.</p>
          ) : (
            <>
              <div id="marksheet-overall" className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#F5F5DC" }}>
                <h2 className="text-xl font-bold mb-4 text-center">Overall Academic Result</h2>
                <div className="border p-4 rounded-lg mb-4 shadow-md">
                  <table className="min-w-full bg-white border-collapse">
                    <tbody>
                      <tr>
                        <td className="border font-bold px-4 py-2" style={{ width: "30%", backgroundColor: "#f3f3f3" }}>Name:</td>
                        <td className="border px-4 py-2" style={{ backgroundColor: "#fafafa" }}>{overallResult.student.name}</td>
                      </tr>
                      <tr>
                        <td className="border font-bold px-4 py-2" style={{ backgroundColor: "#f3f3f3" }}>Roll Number:</td>
                        <td className="border px-4 py-2" style={{ backgroundColor: "#fafafa" }}>{overallResult.student.registration_number}</td>
                      </tr>
                      <tr>
                        <td className="border font-bold px-4 py-2" style={{ backgroundColor: "#f3f3f3" }}>Session:</td>
                        <td className="border px-4 py-2" style={{ backgroundColor: "#fafafa" }}>{overallResult.student.session}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Per semester breakdown */}
                {overallResult.semesters?.map((sem, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="text-lg font-bold mb-2">{sem.semester} Semester</h3>
                    <table className="min-w-full bg-white border-collapse shadow-md rounded-lg">
                      <thead>
                        <tr style={{ backgroundColor: "#f0e5d8" }}>
                          <th className="py-3 px-4 border font-semibold text-left">Course Code</th>
                          <th className="py-3 px-4 border font-semibold text-left">Course Name</th>
                          <th className="py-3 px-4 border font-semibold text-left">GPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sem.results.map((row, i) => (
                          <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fafafa" : "#f5f5f5" }}>
                            <td className="border px-4 py-2">{row.course_code}</td>
                            <td className="border px-4 py-2">{row.course_name}</td>
                            <td className="border px-4 py-2">{row.gpa}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-2 font-semibold text-right">
                      Semester CGPA: {calculateCGPA(sem.results)}
                    </p>
                  </div>
                ))}

                <div className="mt-4 font-bold text-xl border-t pt-4">
                  Overall CGPA: {overallResult.overallCGPA}
                </div>
              </div>
              <button
                onClick={() => downloadPDF("marksheet-overall", `overall_result_${rollNumber}.pdf`)}
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