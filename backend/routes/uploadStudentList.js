const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const prisma = require('../prisma/prismaClient');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const uploadEnrollmentData = async (req, res) => {
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
      const { registration_number, email, session, name } = row;

      console.log('Processing row:', row);

      if (!registration_number || !email || !session) {
        console.error('Missing required field:', { registration_number, email, session });
        continue;
      }

      const existingRecord = await prisma.enrolled.findFirst({
        where: {
          registration_number: registration_number.toString(),
        },
      });

      if (existingRecord) {
        console.log(`Duplicate found for registration_number: ${registration_number}, skipping insertion.`);
        continue;
      }

      await prisma.enrolled.create({
        data: {
          registration_number: registration_number.toString(),
          email: email,
          session: session,
          name: name,
        },
      });
    }
    res.status(200).send('Data uploaded successfully');
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
};

router.post('/uploadStudentList', upload.single('file'), uploadEnrollmentData);

module.exports = router;
