import { useState } from 'react';
import axios from 'axios';

const StudentHistory = () => {
  const [roll, setRoll] = useState('');
  const [session, setSession] = useState('');
  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/history', { roll, session });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter Roll"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          className="mb-4 px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Enter Session"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="mb-4 px-4 py-2 border border-gray-300 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {data && data.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Student History</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
              <th className="border px-4 py-2">Roll</th>
              <th className="border px-4 py-2">Session</th>
              <th className="border px-4 py-2">Semester</th>
                <th className="border px-4 py-2">Course Code</th>
                <th className="border px-4 py-2">Course Name</th>

               

                <th className="border px-4 py-2">Marks</th>
                <th className="border px-4 py-2">GPA</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record) => (
                <tr key={record.id}>
                  <td className="border px-4 py-2">{record.student_roll}</td>
                  <td className="border px-4 py-2">{record.session}</td>
                  <td className="border px-4 py-2">{record.semester}</td>
                  <td className="border px-4 py-2">{record.course_code}</td>
                  <td className="border px-4 py-2">{record.course_name}</td>
                  
                  <td className="border px-4 py-2">{record.marks}</td>
                  <td className="border px-4 py-2">{record.gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8">No data found.</div>
      )}
    </div>
  );
};

export default StudentHistory;