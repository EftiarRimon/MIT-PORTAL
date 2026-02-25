const prisma = require('../prisma/prismaClient');

// Existing — unchanged
const viewResult = async (req, res) => {
  const { semester, session, rollNumber } = req.body;

  try {
    const student = await prisma.student.findUnique({
      where: { registration_number: rollNumber },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const results = await prisma.marksheetData.findMany({
      where: {
        student_roll: rollNumber,
        semester: semester,
        session: session,
      },
      select: {
        course_code: true,
        course_name: true,
        gpa: true,
      },
    });

    if (results.length === 0) {
      return res.status(200).json({ results: [], student });
    }

    res.status(200).json({ results, student });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// New — overall result across all semesters
const viewAllResult = async (req, res) => {
  console.log("viewAllResult hit", req.body); // add this
  const { rollNumber, session } = req.body;

  try {
    const student = await prisma.student.findUnique({
      where: { registration_number: rollNumber },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get all results for this student
    const allResults = await prisma.marksheetData.findMany({
      where: {
        student_roll: rollNumber,
        session: session,
      },
      select: {
        course_code: true,
        course_name: true,
        semester: true,
        gpa: true,
      },
      orderBy: { semester: 'asc' },
    });

    if (allResults.length === 0) {
      return res.status(200).json({ semesters: [], student, overallCGPA: 0 });
    }

    // Group results by semester
    const grouped = {};
    for (const row of allResults) {
      if (!grouped[row.semester]) grouped[row.semester] = [];
      grouped[row.semester].push({
        course_code: row.course_code,
        course_name: row.course_name,
        gpa: row.gpa,
      });
    }

    const semesters = Object.keys(grouped).map(sem => ({
      semester: sem,
      results: grouped[sem],
    }));

    // Overall CGPA across all courses
    const totalGPA = allResults.reduce((sum, r) => sum + r.gpa, 0);
    const overallCGPA = (totalGPA / allResults.length).toFixed(2);

    res.status(200).json({ student, semesters, overallCGPA });
  } catch (error) {
    console.error('Error fetching overall results:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = { viewResult, viewAllResult };