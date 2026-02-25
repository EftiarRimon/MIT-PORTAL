const xlsx = require('xlsx');
const prisma = require('../prisma/prismaClient');

const calculateGPA = (marks) => {
  if (marks >= 80) return 4.00;
  if (marks >= 75) return 3.75;
  if (marks >= 70) return 3.50;
  if (marks >= 65) return 3.25;
  if (marks >= 60) return 3.00;
  if (marks >= 55) return 2.75;
  if (marks >= 50) return 2.50;
  if (marks >= 45) return 2.25;
  if (marks >= 40) return 2.00;
  return 0.00;
};

const uploadResults = async (req, res) => {
  const { courseCode, courseName, semester, session } = req.body;
  const file = req.file;

  if (!file) {
    console.error('No file uploaded');
    return res.status(400).send('No file uploaded');
  }

  try {
    console.log('Reading uploaded file:', file.path);
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log('Data extracted from file:', data);

    for (const row of data) {
      const { roll, marks } = row;

      console.log('Processing row:', row);

      if (!roll || marks === undefined) {
        console.error('Missing required field:', { roll, marks });
        continue;
      }

      const gpa = calculateGPA(marks);
      console.log(`Inserting data for roll: ${roll}, marks: ${marks}, gpa: ${gpa}`);

      const existingRecord = await prisma.marksheetData.findFirst({
        where: {
          student_roll: roll.toString(),
          course_code: courseCode,
          semester: semester,
          session: session,
        },
      });

      if (existingRecord) {
        console.log(`Duplicate found for roll: ${roll}, skipping insertion.`);
        continue;
      }

      await prisma.marksheetData.create({
        data: {
          student_roll: roll.toString(),
          course_code: courseCode,
          course_name: courseName,
          semester: semester,
          session: session,
          marks: marks,
          gpa: gpa,
        },
      });
    }
    res.status(200).send('Data uploaded successfully');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
};

module.exports = { uploadResults };
