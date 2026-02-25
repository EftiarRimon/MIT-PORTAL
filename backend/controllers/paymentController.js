const prisma = require('../prisma/prismaClient');
const path = require('path');

// GET /api/payment/fee-breakdown/:roll/:semester/:session
const getFeeBreakdown = async (req, res) => {
  const { roll, semester, session } = req.params;
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { roll, semester, session },
      include: { course: true },
    });

    if (enrollments.length === 0) {
      return res.status(404).json({ error: 'No enrollments found' });
    }

    const semesterFee = 10000;
    const labUsageFee = 8000;
    let totalFee = semesterFee + labUsageFee;

    const courseFees = enrollments.map(e => {
      const fee = e.course.credit * 4500;
      totalFee += fee;
      return {
        coursename: e.course.coursename,
        credit: e.course.credit,
        fee,
      };
    });

    res.json({ semesterFee, labUsageFee, courseFees, totalFee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/payment/status/:roll/:semester/:session
const getPaymentStatus = async (req, res) => {
  const { roll, semester, session } = req.params;
  try {
    const payment = await prisma.paymentSubmission.findFirst({
      where: { registration_number: roll, semester, session },
    });
    res.json({ status: payment ? payment.status : 'not_submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/payment/submit  (multipart/form-data)
const submitPayment = async (req, res) => {
  const { registration_number, semester, session, transaction_id, total_amount } = req.body;
  const receiptFile = req.file;

  try {
    // Check if already submitted
    const existing = await prisma.paymentSubmission.findFirst({
      where: { registration_number, semester, session },
    });

    const data = {
      registration_number,
      semester,
      session,
      transaction_id,
      total_amount: parseFloat(total_amount),
      status: 'pending',
      submitted_at: new Date(),
      receipt_url: receiptFile ? `uploads/${receiptFile.filename}` : null,
    };

    if (existing) {
      // Re-submission after rejection
      await prisma.paymentSubmission.update({ where: { id: existing.id }, data });
    } else {
      await prisma.paymentSubmission.create({ data });
    }

    res.json({ message: 'Payment submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// GET /api/payment/all?status=pending
const getAllPayments = async (req, res) => {
  const { status } = req.query;
  try {
    const payments = await prisma.paymentSubmission.findMany({
      where: status ? { status } : {},
      include: { student: true },
      orderBy: { submitted_at: 'desc' },
    });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/payment/verify/:id
const verifyPayment = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'verified' or 'rejected'

  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await prisma.paymentSubmission.update({
      where: { id: parseInt(id) },
      data: { status, verified_at: new Date() },
    });
    res.json({ message: `Payment ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getFeeBreakdown, getPaymentStatus, submitPayment, getAllPayments, verifyPayment };