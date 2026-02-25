// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function EnrollmentVerification() {
//   const [enrolled, setEnrolled] = useState([]);
//   const [selected, setSelected] = useState([]);

//   useEffect(() => {
//     const fetchEnrolled = async () => {
//       const response = await axios.get('http://localhost:5000/api/enrolled');
//       setEnrolled(response.data);
//     };
//     fetchEnrolled();
//   }, []);

//   const handleSelect = (student) => {
//     setSelected((prevSelected) => [...prevSelected, student]);
//   };

//   const handleSubmit = async () => {
//     await Promise.all(
//       selected.map(async (student) => {
//         await axios.post('http://localhost:5000/api/students', student);
//       })
//     );
//     alert('Students enrolled successfully');
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <table className="table-auto w-full">
//         <thead>
//           <tr>
//             <th>Registration Number</th>
//             <th>Email</th>
//             <th>Session</th>
//             <th>Name</th>
//             <th>Select</th>
//           </tr>
//         </thead>
//         <tbody>
//           {enrolled.map((student) => (
//             <tr key={student.id}>
//               <td>{student.registration_number}</td>
//               <td>{student.email}</td>
//               <td>{student.session}</td>
//               <td>{student.name}</td>
//               <td>
//                 <button
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                   onClick={() => handleSelect(student)}
//                 >
//                   Select
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <button
//         className="bg-green-500 text-white px-4 py-2 rounded mt-4"
//         onClick={handleSubmit}
//       >
//         Enroll Selected Students
//       </button>
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function EnrollmentVerification() {
//   const [enrolled, setEnrolled] = useState([]);
//   const [selected, setSelected] = useState([]);

//   useEffect(() => {
//     const fetchEnrolled = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/enrolled');
//         setEnrolled(response.data);
//       } catch (error) {
//         console.error('Error fetching enrolled students:', error);
//       }
//     };
//     fetchEnrolled();
//   }, []);

//   const handleSelect = (student) => {
//     setSelected((prevSelected) => {
//       if (prevSelected.some(selectedStudent => selectedStudent.id === student.id)) {
//         return prevSelected.filter(selectedStudent => selectedStudent.id !== student.id);
//       } else {
//         return [...prevSelected, student];
//       }
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       await Promise.all(
//         selected.map(async (student) => {
//           await axios.post('http://localhost:5000/api/students', {
//             registration_number: student.registration_number,
//             email: student.email,
//             session: student.session,
//             name: student.name,
//           });
//         })
//       );
//       alert('Students enrolled successfully');
//       setSelected([]);
//     } catch (error) {
//       console.error('Error enrolling students:', error);
//       alert('Failed to enroll students. Please try again.');
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <table className="table-auto w-full">
//         <thead>
//           <tr>
//             <th>Registration Number</th>
//             <th>Email</th>
//             <th>Session</th>
//             <th>Name</th>
//             <th>Select</th>
//           </tr>
//         </thead>
//         <tbody>
//           {enrolled.map((student) => (
//             <tr key={student.id}>
//               <td>{student.registration_number}</td>
//               <td>{student.email}</td>
//               <td>{student.session}</td>
//               <td>{student.name}</td>
//               <td>
//                 <button
//                   className={`px-4 py-2 rounded ${selected.some(selectedStudent => selectedStudent.id === student.id) ? 'bg-red-500' : 'bg-blue-500'} text-white`}
//                   onClick={() => handleSelect(student)}
//                 >
//                   {selected.some(selectedStudent => selectedStudent.id === student.id) ? 'Deselect' : 'Select'}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {selected.length > 0 && (
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded mt-4"
//           onClick={handleSubmit}
//         >
//           Enroll Selected Students
//         </button>
//       )}
//     </div>
//   );
// }
//pages/enrollmentVerification.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const EnrollmentVerification = () => {
//   const [enrolledStudents, setEnrolledStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   useEffect(() => {
//     fetchEnrolledStudents();
//   }, []);

//   const fetchEnrolledStudents = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/enrollments');
//       setEnrolledStudents(response.data);
//     } catch (error) {
//       console.error('Error fetching enrolled students:', error);
//     }
//   };

//   const handleSelectStudent = (student) => {
//     setSelectedStudent(student);
//   };

//   const handleSaveStudent = async () => {
//     try {
//       const { registration_number, email, session, name } = selectedStudent;
//       if (registration_number && email && session && name) {
//         await axios.post('http://localhost:5000/api/students', selectedStudent);
//         console.log('Student saved successfully');
//         // Optionally, reset the selected student or perform additional operations
//         setSelectedStudent(null);
//       } else {
//         console.error('Selected student does not have all required fields.');
//       }
//     } catch (error) {
//       console.error('Error saving student:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-2xl font-bold mb-4">Enrollment Verification</h1>
//       <table className="w-full border-collapse">
//         <thead>
//           <tr>
//             <th className="border px-4 py-2">Registration Number</th>
//             <th className="border px-4 py-2">Email</th>
//             <th className="border px-4 py-2">Session</th>
//             <th className="border px-4 py-2">Name</th>
//             <th className="border px-4 py-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {enrolledStudents.map((student) => (
//             <tr key={student.id}>
//               <td className="border px-4 py-2">{student.registration_number}</td>
//               <td className="border px-4 py-2">{student.email}</td>
//               <td className="border px-4 py-2">{student.session}</td>
//               <td className="border px-4 py-2">{student.name}</td>
//               <td className="border px-4 py-2">
//                 <button
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                   onClick={() => handleSelectStudent(student)}
//                 >
//                   Select
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {selectedStudent && (
//         <div className="mt-4">
//           <h2 className="text-xl font-bold mb-2">Selected Student</h2>
//           <p>Registration Number: {selectedStudent.registration_number}</p>
//           <p>Email: {selectedStudent.email}</p>
//           <p>Session: {selectedStudent.session}</p>
//           <p>Name: {selectedStudent.name}</p>
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded mt-2"
//             onClick={handleSaveStudent}
//           >
//             Save Student
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnrollmentVerification;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EnrollmentVerification = () => {
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/enrollments');
      setEnrolledStudents(response.data);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    }
  };

  const handleSelect = (student) => {
    setSelected((prev) =>
      prev.some(s => s.registration_number === student.registration_number)
        ? prev.filter(s => s.registration_number !== student.registration_number)
        : [...prev, student]
    );
  };

  const handleSaveStudents = async () => {
    try {
      await Promise.all(
        selected.map(student =>
          axios.post('http://localhost:5000/api/students', {
            registration_number: student.registration_number,
            email: student.email,
            session: student.session,
            name: student.name,
          })
        )
      );

      // enrolled table theke remove koro
      await Promise.all(
        selected.map(student =>
          axios.delete(`http://localhost:5000/api/enrollments/${student.registration_number}`)
        )
      );

      alert('Students verified successfully');
      setSelected([]);
      fetchEnrolledStudents();
    } catch (error) {
      console.error('Error saving students:', error);
      alert('Failed to verify students.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Enrollment Verification</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Registration Number</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Session</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {enrolledStudents.map((student) => (
            <tr key={student.registration_number}>
              <td className="border px-4 py-2">{student.registration_number}</td>
              <td className="border px-4 py-2">{student.email}</td>
              <td className="border px-4 py-2">{student.session}</td>
              <td className="border px-4 py-2">{student.name}</td>
              <td className="border px-4 py-2">
                <button
                  className={`px-4 py-2 rounded text-white ${
                    selected.some(s => s.registration_number === student.registration_number)
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                  onClick={() => handleSelect(student)}
                >
                  {selected.some(s => s.registration_number === student.registration_number)
                    ? 'Deselect'
                    : 'Select'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected.length > 0 && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          onClick={handleSaveStudents}
        >
          Verify {selected.length} Student(s)
        </button>
      )}
    </div>
  );
};

export default EnrollmentVerification;