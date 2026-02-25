
const express = require('express');
const prisma = require('../prisma/prismaClient');
const htmlPdf = require('html-pdf-node');

const router = express.Router();

router.get('/paymentSlip/:roll/:semester/:session', async (req, res) => {
  const { roll, semester, session } = req.params;

  try {
    // Fetch enrolled courses for the student
    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        roll: roll,
        semester: semester,
        session: session,
      },
      include: {
        course: true,
        student: true,
      },
    });

    if (enrollments.length === 0) {
      return res.status(404).send('No enrollments found');
    }

    const student = enrollments[0].student;

    // Calculate fees
    const semesterFee = 10000;
    const labUsageFee = 8000;
    let totalFee = semesterFee + labUsageFee;

    const courseFees = enrollments.map(enrollment => {
      const credits = enrollment.course.credit; // Ensure 'credit' is the correct field
      const fee = credits * 4500;
      totalFee += fee;
      return { course: enrollment.course.coursename, fee: fee };
    });

    // Generate HTML template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Payment Slip</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background-color: #ffcccb; }
          h1 { text-align: center; }
          .info { margin-bottom: 20px; }
          .info div { margin-bottom: 5px; }
          .fee-table { width: 100%; border-collapse: collapse; }
          .fee-table, .fee-table th, .fee-table td { border: 1px solid black; }
          .fee-table th, .fee-table td { padding: 8px; text-align: left; }
          .fee-table th { background-color: #f2f2f2; }
          .total { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Payment Slip</h1>
        <div class="info">
          <div><strong>Name:</strong> ${student.name}</div>
          <div><strong>Roll:</strong> ${roll}</div>
          <div><strong>Session:</strong> ${session}</div>
          <div><strong>Semester:</strong> ${semester}</div>
        </div>
        <table class="fee-table">
          <tr>
            <th>Particulars</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>Semester Fee</td>
            <td>10,000</td>
          </tr>
          <tr>
            <td>Lab Usage Fee</td>
            <td>8,000</td>
          </tr>
          ${courseFees.map(fee => `
            <tr>
              <td>${fee.course} Fee</td>
              <td>${fee.fee}</td>
            </tr>
          `).join('')}
          <tr class="total">
            <td>Total Fee</td>
            <td>${totalFee}</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Convert HTML to PDF
    const file = { content: htmlTemplate };
    const options = { format: 'A4' };

    htmlPdf.generatePdf(file, options).then(pdfBuffer => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=paymentSlip.pdf');
      res.send(pdfBuffer);
    }).catch(error => {
      console.error(error);
      res.status(500).send('Server error');
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
