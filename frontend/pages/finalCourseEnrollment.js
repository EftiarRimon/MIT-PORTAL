import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FinalCourseEnrollment() {
  const [roll, setRoll] = useState('');
  const [session, setSession] = useState('');
  const [semester, setSemester] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-fill roll, session, semester from token on mount
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5000/api/dashboard/student-info',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRoll(response.data.registration_number);
        setSession(response.data.session);
        setSemester(response.data.currentSemester || '');
      } catch (error) {
        console.error('Error fetching student info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, []);

  const fetchFinalizedCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/finalized-courses?roll=${roll}&session=${session}&semester=${semester}`
      );
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching finalized courses:', error);
      alert('Failed to fetch courses');
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Final Course Enrollment</h1>

      {/* Auto-filled info — read only */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Roll Number</label>
          <p className="font-semibold text-gray-800">{roll}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Session</label>
          <p className="font-semibold text-gray-800">{session}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Semester</label>
          <p className="font-semibold text-gray-800">{semester}</p>
        </div>
      </div>

      <button
        onClick={fetchFinalizedCourses}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Fetch Courses
      </button>

      {courses.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Finalized Courses</h2>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Course Code</th>
                <th className="border px-4 py-2">Course Name</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="border px-4 py-2">{enrollment.coursecode}</td>
                  <td className="border px-4 py-2">{enrollment.course?.coursename}</td>
                  <td className="border px-4 py-2">{enrollment.type}</td>
                  <td className="border px-4 py-2">
                    <span className="px-2 py-1 rounded text-white text-sm bg-green-500">
                      {enrollment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}