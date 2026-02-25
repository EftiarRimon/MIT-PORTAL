import { useState } from 'react';
import axios from 'axios';

export default function FinalizeCourse() {
  const [session, setSession] = useState('');
  const [semester, setSemester] = useState('');
  const [enrollments, setEnrollments] = useState([]);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/course-enrollments?session=${session}&semester=${semester}`
      );
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/course-enrollments/${id}/finalize`);
      setEnrollments(enrollments.map(e => 
        e.id === id ? { ...e, status: 'finalized' } : e
      ));
    } catch (error) {
      console.error('Error finalizing enrollment:', error);
    }
  };

  const handleApproveAll = async () => {
    try {
      await axios.put(`http://localhost:5000/api/course-enrollments/finalize-all`, 
        { session, semester }
      );
      setEnrollments(enrollments.map(e => ({ ...e, status: 'finalized' })));
      alert('All courses finalized successfully');
    } catch (error) {
      console.error('Error finalizing all:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Finalize Course Selection</h1>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block mb-2">Session</label>
          <input
            type="text"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            placeholder="e.g. 2022-23"
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Semester</option>
            <option value="1st">1st Semester</option>
            <option value="2nd">2nd Semester</option>
            <option value="3rd">3rd Semester</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchEnrollments}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Fetch
          </button>
        </div>
      </div>

      {enrollments.length > 0 && (
        <>
          <button
            onClick={handleApproveAll}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            Approve All
          </button>
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Roll</th>
                <th className="border px-4 py-2">Course Code</th>
                <th className="border px-4 py-2">Course Name</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="border px-4 py-2">{enrollment.roll}</td>
                  <td className="border px-4 py-2">{enrollment.coursecode}</td>
                  <td className="border px-4 py-2">{enrollment.course?.coursename}</td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded text-white text-sm ${
                      enrollment.status === 'finalized' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    {enrollment.status !== 'finalized' && (
                      <button
                        onClick={() => handleApprove(enrollment.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}