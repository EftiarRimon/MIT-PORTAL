import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CourseOffer() {
  const [session, setSession] = useState('');
  const [semester, setSemester] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCourseSelection = (coursecode) => {
    if (selectedCourses.includes(coursecode)) {
      setSelectedCourses(selectedCourses.filter(c => c !== coursecode));
    } else {
      setSelectedCourses([...selectedCourses, coursecode]);
    }
  };

  const handleSubmit = async () => {
    if (!session || !semester) {
      alert('Please select session and semester');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/offer-courses', {
        session,
        semester,
        selectedCourses
      });
      alert('Courses offered successfully');
      setSelectedCourses([]);
    } catch (error) {
      console.error('Error offering courses:', error);
      alert('Failed to offer courses');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Offer</h1>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block mb-2">Session</label>
          <input
            type="text"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            placeholder="e.g. 2021-22"
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
      </div>

      <table className="table-auto w-full border mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Select</th>
            <th className="border px-4 py-2">Course Code</th>
            <th className="border px-4 py-2">Course Name</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Credit</th>
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
              <td className="border px-4 py-2">{course.credit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCourses.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Offer {selectedCourses.length} Course(s)
        </button>
      )}
    </div>
  );
}