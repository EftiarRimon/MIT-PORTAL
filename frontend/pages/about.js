import React, { useState } from "react";
import Link from "next/link";
import Header from "./Land/Header";
import Footer from "./Land/Footer";

const AboutPage = () => {
  const [showInformation, setShowInformation] = useState(false);
  const [showAdmission, setShowAdmission] = useState(false);

  const handleInformationClick = () => {
    setShowInformation(!showInformation);
    setShowAdmission(false);
  };

  const handleAdmissionClick = () => {
    setShowAdmission(!showAdmission);
    setShowInformation(false);
  };

  return (
    React.createElement(React.Fragment, null,
      React.createElement(Header, null),
      React.createElement("div", { className: "min-h-screen bg-blackish py-12" }, 
        React.createElement("div", { className: "container mx-auto px-4" }, 
          React.createElement("h1", { className: "text-4xl font-bold text-center mb-8 text-white" }, "About MIT"),
          React.createElement("div", { className: "flex justify-center mb-8" }, 
            React.createElement("button", {
              onClick: handleInformationClick,
              className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            }, "Information"),
            React.createElement("button", {
              onClick: handleAdmissionClick,
              className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            }, "Admission")
          ),
          showInformation && (
            React.createElement("div", { className: "bg-white p-8 rounded-lg shadow-md mb-8" }, 
              React.createElement("h2", { className: "text-2xl font-bold mb-4" }, "Information"),
              React.createElement("p", { className: "mb-4" }, 
                "The program extends over 3 (three) semesters (6 months/semester) of study. Classes will be held in the evening. The program requires 30 credits of course work and 6 credits of project/internship (total 36 credits)."
              ),
              React.createElement("p", null, 
                "For further details, download the latest MIT ",
                React.createElement(Link, {
                  href: "http://www.iit.du.ac.bd/notice/download/696",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-blue-500 underline"
                }, "Admission Brochure for MIT 5th Batch")
              )
            )
          ),
          showAdmission && (
            React.createElement("div", { className: "bg-white p-8 rounded-lg shadow-md" }, 
              React.createElement("h2", { className: "text-2xl font-bold mb-4" }, 
                "Executive Master in Information Technology (MIT)"
              ),
              React.createElement("h3", { className: "text-xl font-bold mb-4" }, 
                "Admission Notice, Session: 2024-2025 (Fall)"
              ),
              React.createElement("p", { className: "mb-4" }, 
                "Applications are invited from prospective students desiring to take the Executive Master in Information Technology (MIT), to be offered by the Institute of Information Technology (IIT), University of Dhaka. Forty (40) students will be taken on the basis of merit. Applicants must satisfy the following requirements:"
              ),
              React.createElement("ol", { className: "list-decimal pl-6 mb-4" }, 
                React.createElement("li", null, 
                  "4-year graduation in SE/CS/CSE/CIT/IT/ICT/ECE/ETE/EEE (or equivalent degree)."
                ),
                React.createElement("li", null, 
                  "Candidates must have at least CGPA 2.50 on a scale of 4.00 (or equivalent) at the graduation level."
                ),
                React.createElement("li", null, 
                  "No third class/division (or equivalent) in any public examination."
                )
              )
            )
          )
        )
      ),
      React.createElement(Footer, null)
    )
  );
};

export default AboutPage;
