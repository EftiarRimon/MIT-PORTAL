// components/Marksheet.jsx

import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Marksheet = () => {
  const [excelData, setExcelData] = useState([]);
  const [students, setStudents] = useState([]);

  const handleFileUpload = (e) => {
    const files = e.target.files;

    for (const file of files) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setExcelData((prevData) => [...prevData, jsonData]);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const generateMarksheets = () => {
    if (excelData.length > 0) {
      const processedStudents = {};

      // Iterate over each Excel file
      for (const excelFile of excelData) {
        // Skip the header row
        const studentRows = excelFile.slice(1);

        for (const studentRow of studentRows) {
          const name = studentRow[0];
          const roll = studentRow[1];
          const subjectName = studentRow[2];
          const marks = parseInt(studentRow[3]);
          const credits = parseInt(studentRow[4]);

          if (!processedStudents[roll]) {
            processedStudents[roll] = {
              name,
              roll,
              subjects: [],
            };
          }

          processedStudents[roll].subjects.push({
            name: subjectName,
            marks,
            credits,
          });
        }
      }

      setStudents(Object.values(processedStudents));

      // Generate PDF marksheets for each student
      Object.values(processedStudents).forEach((student) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Marksheet", 20, 20);

        doc.setFontSize(12);
        doc.text(`Name: ${student.name}`, 20, 30);
        doc.text(`Roll: ${student.roll}`, 20, 40);

        const totalCGPA = calculateAverageCGPA(student.subjects);
        doc.text(`Total Average CGPA: ${totalCGPA}`, 20, 50);

        const headers = [["Subject Name", "Marks", "CGPA", "Credits"]];
        const data = student.subjects.map((subject) => {
          const subjectCGPA = calculateSubjectCGPA(subject.marks);
          return [subject.name, subject.marks, subjectCGPA, subject.credits];
        });

        const startY = 60;
        doc.autoTable({
          head: headers,
          body: data,
          startY,
          styles: {
            fontSize: 10,
            halign: "center",
            valign: "middle",
            fillColor: [230, 230, 230],
            textColor: [0, 0, 0],
          },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 30 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
          },
          headStyles: {
            fillColor: [128, 128, 128],
            textColor: [255, 255, 255],
          },
        });

        const pdfData = doc.output("arraybuffer");
        const blob = new Blob([pdfData], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `marksheet_${student.roll}.pdf`;
        link.click();
      });
    }
  };

  const calculateAverageCGPA = (subjects) => {
    const cgpaArray = subjects.map((subject) =>
      calculateSubjectCGPA(subject.marks)
    );
    const totalCGPA = cgpaArray.reduce((acc, curr) => acc + curr, 0);
    const averageCGPA = totalCGPA / subjects.length;
    return averageCGPA.toFixed(2);
  };

  const calculateSubjectCGPA = (marks) => {
    if (marks >= 80 && marks <= 100) return 4.0;
    else if (marks >= 75 && marks <= 79) return 3.75;
    else if (marks >= 70 && marks <= 74) return 3.5;
    else if (marks >= 65 && marks <= 69) return 3.25;
    else if (marks >= 60 && marks <= 64) return 3.0;
    else if (marks >= 55 && marks <= 59) return 2.75;
    else if (marks >= 50 && marks <= 54) return 2.5;
    else if (marks >= 45 && marks <= 49) return 2.25;
    else if (marks >= 40 && marks <= 44) return 2.0;
    else return 0.0;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">Marksheet Generator</h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            multiple
            className="mb-4"
          />
          <button
            onClick={generateMarksheets}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Generate Marksheets
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marksheet;
