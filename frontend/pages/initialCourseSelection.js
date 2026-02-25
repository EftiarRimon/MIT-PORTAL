import { useState, useEffect } from "react";
import axios from "axios";

export default function InitialCourseSelection() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // enrollmentStatus: null = not enrolled, 'pending' = preliminary, 'confirmed' = finalized
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Course selection state
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");

        // Step 1: Get student info
        const infoRes = await axios.get(
          "http://localhost:5000/api/dashboard/student-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const info = infoRes.data;
        setStudentInfo(info);

        // Step 2: Check if already enrolled this semester
        if (info.registration_number && info.session && info.currentSemester) {
          const statusRes = await axios.get(
            `http://localhost:5000/api/enrollment-status?roll=${info.registration_number}&session=${info.session}&semester=${info.currentSemester}`
          );

          if (statusRes.data.enrolled && statusRes.data.courses.length > 0) {
            setEnrolledCourses(statusRes.data.courses);
            const allFinalized = statusRes.data.courses.every(
              c => c.status === 'finalized'
            );
            setEnrollmentStatus(allFinalized ? 'confirmed' : 'pending');
          }
        }
      } catch (error) {
        console.error("Init error:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/initial-course-selection",
        {
          roll: studentInfo.registration_number,
          session: studentInfo.session,
          semester: studentInfo.currentSemester,
        }
      );
      setCourses(response.data.courses);
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleCourseSelection = (course_code) => {
    if (selectedCourses.includes(course_code)) {
      setSelectedCourses(selectedCourses.filter(c => c !== course_code));
    } else {
      setSelectedCourses([...selectedCourses, course_code]);
    }
  };

  const handleSubmit = async () => {
    if (studentInfo.currentSemester === "1st" && selectedCourses.length !== 4) {
      alert("1st Semester students must select exactly 4 courses before submitting.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/submit-course-selection", {
        roll: studentInfo.registration_number,
        session: studentInfo.session,
        semester: studentInfo.currentSemester,
        selectedCourses,
      });

      // Re-fetch enrollment status after submit
      const statusRes = await axios.get(
        `http://localhost:5000/api/enrollment-status?roll=${studentInfo.registration_number}&session=${studentInfo.session}&semester=${studentInfo.currentSemester}`
      );
      setEnrolledCourses(statusRes.data.courses);
      setEnrollmentStatus('pending');
      setCourses([]);
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Failed to enroll courses.");
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Initial Course Selection</h1>

      {/* Auto-filled student info */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Roll Number</label>
          <p className="font-semibold text-gray-800">{studentInfo?.registration_number}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Session</label>
          <p className="font-semibold text-gray-800">{studentInfo?.session}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Semester</label>
          <p className="font-semibold text-gray-800">{studentInfo?.currentSemester}</p>
        </div>
      </div>

      {/* ── CONFIRMED ── */}
      {enrollmentStatus === 'confirmed' && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-5 mb-6">
          <p className="font-bold text-green-800 text-lg mb-1">✅ Course Enrollment Confirmed</p>
          <p className="text-green-700 text-sm mb-4">
            Your courses for this semester have been confirmed by the Course Teacher.
          </p>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-green-100">
                <th className="border px-4 py-2 text-left">Course Code</th>
                <th className="border px-4 py-2 text-left">Course Name</th>
                <th className="border px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((c, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{c.coursecode}</td>
                  <td className="border px-4 py-2">{c.course?.coursename}</td>
                  <td className="border px-4 py-2">
                    <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">✅ Confirmed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PENDING ── */}
      {enrollmentStatus === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 mb-6">
          <p className="font-bold text-yellow-800 text-lg mb-1">⏳ Awaiting Course Teacher Approval</p>
          <p className="text-yellow-700 text-sm mb-4">
            Your course selection has been submitted and is pending approval from the Course Teacher.
          </p>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-yellow-100">
                <th className="border px-4 py-2 text-left">Course Code</th>
                <th className="border px-4 py-2 text-left">Course Name</th>
                <th className="border px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((c, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{c.coursecode}</td>
                  <td className="border px-4 py-2">{c.course?.coursename}</td>
                  <td className="border px-4 py-2">
                    <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">⏳ Pending</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── NOT ENROLLED YET — show selection form ── */}
      {!enrollmentStatus && (
        <>
          {studentInfo?.currentSemester === "1st" && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded">
              <p className="font-bold">⚠️ Notice for 1st Semester Students</p>
              <p className="mt-1">
                All students enrolled in the 1st Semester are required to select exactly{" "}
                <strong>4 courses (12 credits)</strong>. Course selection will not be accepted unless all 4 courses have been chosen.
              </p>
            </div>
          )}

          <button
            onClick={fetchCourses}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Fetch Courses
          </button>

          {courses.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Available Courses</h2>
              <div className="mb-3 text-sm text-gray-600">
                Selected:{" "}
                <span className={`font-bold ${studentInfo?.currentSemester === "1st" && selectedCourses.length !== 4 ? "text-red-500" : "text-green-600"}`}>
                  {selectedCourses.length} course{selectedCourses.length !== 1 ? "s" : ""}
                </span>
                {studentInfo?.currentSemester === "1st" && (
                  <span className="ml-2 text-gray-500">(exactly 4 required)</span>
                )}
              </div>
              <table className="table-auto w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Select</th>
                    <th className="border px-4 py-2">Course Code</th>
                    <th className="border px-4 py-2">Course Name</th>
                    <th className="border px-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.coursecode}>
                      <td className="border px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.coursecode)}
                          onChange={() => handleCourseSelection(course.coursecode)}
                        />
                      </td>
                      <td className="border px-4 py-2">{course.coursecode}</td>
                      <td className="border px-4 py-2">{course.coursename}</td>
                      <td className="border px-4 py-2">{course.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedCourses.length > 0 && (
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                >
                  Submit Selection
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}