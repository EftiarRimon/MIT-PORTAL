import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyCourse() {
  const [teacher, setTeacher] = useState(null);
  const [course, setCourse] = useState(null);
  const [enrollmentCount, setEnrollmentCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        // Get teacher email from token payload
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email;

        const { data } = await axios.get(`http://localhost:5000/api/teachers/me?email=${encodeURIComponent(email)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeacher(data);
        setCourse(data.course || null);

        // Get enrollment count
        if (data.coursecode) {
          const eRes = await axios.get(
            `http://localhost:5000/api/course-enrollments-count?coursecode=${data.coursecode}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setEnrollmentCount(eRes.data.count);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const response = await axios.get(
        `http://localhost:5000/api/teachers/${encodeURIComponent(payload.email)}/students`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_${teacher.coursecode}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to download student list.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 animate-pulse">Loading your course info...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Course</h1>
          <p className="text-slate-500 mt-1">Welcome, {teacher?.name}</p>
        </div>

        {!teacher?.coursecode ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No Course Assigned</h2>
            <p className="text-slate-400">Please contact the Course Coordinator to get a course assigned to you.</p>
          </div>
        ) : (
          <>
            {/* Course Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">
                    {teacher.coursecode}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 mt-2">
                    {course?.coursename || teacher.coursecode}
                  </h2>
                  {course && (
                    <div className="mt-2 flex gap-4 text-sm text-slate-500">
                      <span>Credits: <span className="font-semibold text-slate-700">{course.credit}</span></span>
                      <span>Type: <span className="font-semibold text-slate-700">{course.type}</span></span>
                    </div>
                  )}
                </div>
                {enrollmentCount !== null && (
                  <div className="text-center bg-slate-50 rounded-xl px-5 py-3">
                    <div className="text-3xl font-bold text-slate-800">{enrollmentCount}</div>
                    <div className="text-xs text-slate-500 mt-1">Students</div>
                  </div>
                )}
              </div>
            </div>

            {/* Teacher Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-slate-700 mb-4">Your Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">Name</span>
                  <p className="font-medium text-slate-800">{teacher.name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Email</span>
                  <p className="font-medium text-slate-800">{teacher.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">Designation</span>
                  <p className="font-medium text-slate-800">{teacher.designation || '—'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Role</span>
                  <p className="font-medium text-slate-800">{teacher.role}</p>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadPDF}
              disabled={downloading}
              className="w-full bg-slate-800 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>⏳ Generating PDF...</>
              ) : (
                <>📄 Download Student List (PDF)</>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}