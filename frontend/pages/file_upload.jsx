import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "@/libs/axios";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setData(jsonData);
        console.log(jsonData);

        sendToBackend(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const sendToBackend = async (jsonData) => {
    const requestBody = jsonData.map((arr) => ({
      registration_number: arr[0].toString(),
      name: arr[1],
      email: arr[2],
      session: arr[3],
    }));

    console.log(requestBody);
    await axios
      .post("/enroll/upload", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => alert("Uploaded"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">
          Upload Student List
        </h2>
        <div className="flex flex-col items-center justify-center">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="mb-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm file-input file-input-bordered file-input-primary w-full max-w-xs"
          />
          <button
            onClick={handleUpload}
            disabled={!file}
            className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 btn btn-primary disabled:opacity-50"
          >
            Upload File
          </button>
        </div>
        {data.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">File Data</h3>
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 font-semibold">
                    Registration Number
                  </th>
                  <th className="px-4 py-2 font-semibold">Name</th>
                  <th className="px-4 py-2 font-semibold">Email</th>
                  <th className="px-4 py-2 font-semibold">Session</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(1).map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="border px-4 py-2">{row[0]}</td>
                    <td className="border px-4 py-2">{row[1]}</td>
                    <td className="border px-4 py-2">{row[2]}</td>
                    <td className="border px-4 py-2">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
