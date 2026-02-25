const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.initialCourseSelection = async (req, res) => {
  const { roll, session, semester } = req.body;

  try {
    // Check if student already enrolled in this semester
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: { roll, session, semester }
    });

    if (existingEnrollment) {
      return res.status(400).json({ alreadyEnrolled: true, message: 'You have already selected courses for this semester.' });
    }

    let courses;

    if (semester === "1st") {
      // Fixed 4 mandatory courses for 1st semester
      const firstSemesterCodes = ['MITM303', 'MITM304', 'MITM310', 'MITM311'];
      courses = await prisma.course.findMany({
        where: { coursecode: { in: firstSemesterCodes } }
      });
    } else {
      const passedCourses = await prisma.marksheetData.findMany({
        where: { student_roll: roll, gpa: { gt: 0 } },
        select: { coursecode: true }
      });

      const passedCourseCodes = passedCourses.map(c => c.coursecode);

      courses = await prisma.course.findMany({
        where: { coursecode: { notIn: passedCourseCodes } }
      });
    }

    res.json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching courses." });
  }
};

exports.submitCourseSelection = async (req, res) => {
  const { roll, session, semester, selectedCourses } = req.body;

  try {
    // Double-check: already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: { roll, session, semester }
    });

    if (existingEnrollment) {
      return res.status(400).json({ alreadyEnrolled: true, message: 'You have already submitted course selection for this semester.' });
    }

    for (const coursecode of selectedCourses) {
      await prisma.courseEnrollment.create({
        data: {
          roll,
          session,
          semester,
          coursecode,
          type: 'regular',
          status: 'preliminary'  // always preliminary until teacher approves
        }
      });

      const selectedCourse = await prisma.selectedCourse.findFirst({
        where: { coursecode, session, semester }
      });

      if (selectedCourse) {
        await prisma.selectedCourse.update({
          where: { id: selectedCourse.id },
          data: { currentlyEnrolled: { increment: 1 } }
        });
      }
    }

    res.status(200).json({ message: "Courses successfully enrolled." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while enrolling in courses." });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
};

exports.offerCourses = async (req, res) => {
  const { session, semester, selectedCourses } = req.body;
  try {
    for (const coursecode of selectedCourses) {
      await prisma.selectedCourse.create({
        data: { session, semester, coursecode, currentlyEnrolled: 0 }
      });
    }
    res.status(200).json({ message: 'Courses offered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error offering courses' });
  }
};

exports.getCourseEnrollments = async (req, res) => {
  const { session, semester } = req.query;
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { session, semester },
      include: { course: true }
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching enrollments' });
  }
};

exports.finalizeEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    const enrollment = await prisma.courseEnrollment.update({
      where: { id: parseInt(id) },
      data: { status: 'finalized' }
    });
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Error finalizing enrollment' });
  }
};

exports.finalizeAllEnrollments = async (req, res) => {
  const { session, semester } = req.body;
  try {
    await prisma.courseEnrollment.updateMany({
      where: { session, semester, status: 'preliminary' },
      data: { status: 'finalized' }
    });
    res.json({ message: 'All enrollments finalized' });
  } catch (error) {
    res.status(500).json({ error: 'Error finalizing enrollments' });
  }
};

exports.getFinalizedCourses = async (req, res) => {
  const { roll, session, semester } = req.query;
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { roll, session, semester, status: 'finalized' },
      include: { course: true }
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching finalized courses' });
  }
};