const bcrypt = require('bcryptjs');
const prisma = require('../prisma/prismaClient');
const htmlPdf = require('html-pdf-node');

// GET /api/teachers â€” only Course Teachers
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { role: 'Course Teacher' },
      select: { email: true, name: true, designation: true, coursecode: true, role: true },
      orderBy: { name: 'asc' },
    });
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/courses-list
const getCoursesList = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      select: { coursecode: true, coursename: true },
      orderBy: { coursecode: 'asc' },
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/teachers â€” create new Course Teacher (designation & role fixed)
const createTeacher = async (req, res) => {
  const { email, name, password, coursecode } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Email, name, and password are required.' });
  }
  try {
    const existing = await prisma.teacher.findUnique({ where: { email } });
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existing || existingUser) {
      return res.status(409).json({ error: 'Teacher with this email already exists.' });
    }
    const hash = await bcrypt.hash(password, 10);
    // teacher profile and login account are created together or not at all
    const [teacher] = await prisma.$transaction([
      prisma.teacher.create({
        data: {
          email,
          name,
          designation: 'Course Teacher',
          password: hash,
          role: 'Course Teacher',
          coursecode: coursecode || null,
        },
      }),
      prisma.user.create({
        data: { email, role: 'teacher', password: hash },
      }),
    ]);
    const { password: _omit, ...safeTeacher } = teacher;
    res.status(201).json(safeTeacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
// PATCH /api/teachers/:email/assign-course
const assignCourse = async (req, res) => {
  const { email } = req.params;
  const { coursecode } = req.body;
  try {
    const teacher = await prisma.teacher.update({
      where: { email },
      data: { coursecode: coursecode || null },
    });
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// GET /api/teachers/:email/students â€” PDF
const getStudentListPDF = async (req, res) => {
  const { email } = req.params;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher || !teacher.coursecode) {
      return res.status(404).json({ error: 'Teacher or assigned course not found.' });
    }
    const course = await prisma.course.findUnique({ where: { coursecode: teacher.coursecode } });
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { coursecode: teacher.coursecode },
      include: { student: true },
      orderBy: { id: 'asc' },
    });

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <style>
        body{font-family:Arial,sans-serif;margin:30px;color:#222}
        h1{text-align:center;font-size:22px;margin-bottom:4px}
        .sub{text-align:center;color:#555;font-size:14px;margin-bottom:24px}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{background:#1e3a5f;color:white;padding:10px 12px;text-align:left}
        td{padding:8px 12px;border-bottom:1px solid #e0e0e0}
        tr:nth-child(even) td{background:#f5f8ff}
        .footer{margin-top:20px;font-size:12px;color:#888;text-align:right}
      </style></head><body>
      <h1>Student List</h1>
      <div class="sub">Course: <strong>${course?.coursename || teacher.coursecode}</strong> (${teacher.coursecode}) &nbsp;|&nbsp; Teacher: <strong>${teacher.name}</strong></div>
      <table><thead><tr><th>#</th><th>Name</th><th>Roll Number</th><th>Email</th><th>Session</th><th>Semester</th><th>Status</th></tr></thead>
      <tbody>${enrollments.map((e, i) => `<tr><td>${i+1}</td><td>${e.student?.name||'-'}</td><td>${e.roll}</td><td>${e.student?.email||'-'}</td><td>${e.session}</td><td>${e.semester}</td><td>${e.status}</td></tr>`).join('')}</tbody>
      </table><div class="footer">Generated on ${new Date().toLocaleString()}</div></body></html>`;

    const pdfBuffer = await htmlPdf.generatePdf({ content: html }, { format: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=students_${teacher.coursecode}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// GET /api/teachers/me?email=...
const getMyInfo = async (req, res) => {
  const { email } = req.query;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    const course = teacher.coursecode
      ? await prisma.course.findUnique({ where: { coursecode: teacher.coursecode } })
      : null;
    res.json({ ...teacher, course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllTeachers, getCoursesList, createTeacher, assignCourse, getStudentListPDF, getMyInfo };
