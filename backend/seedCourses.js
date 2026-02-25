const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const courses = [
    // 1st Semester (Mandatory)
    { coursecode: 'MITM303', coursename: 'Advanced Computer Networks & Internetworking', type: 'mandatory', credit: 3 },
    { coursecode: 'MITM304', coursename: 'Database Architecture and Administration',      type: 'mandatory', credit: 3 },
    { coursecode: 'MITM310', coursename: 'Advanced Data Structures and Algorithms',       type: 'mandatory', credit: 3 },
    { coursecode: 'MITM311', coursename: 'Advanced Object-Oriented Programming',          type: 'mandatory', credit: 3 },

    // 2nd Semester (Mandatory)
    { coursecode: 'MITM301', coursename: 'IT Project Management',                         type: 'mandatory', credit: 3 },
    { coursecode: 'MITM305', coursename: 'Web Technology and Internet Computing',         type: 'mandatory', credit: 3 },

    // 3rd Semester (Mandatory)
    { coursecode: 'MITM421', coursename: 'Project for MIT / Internship',                  type: 'mandatory', credit: 6 },

    // Elective: Data Science Track
    { coursecode: 'MITE436', coursename: 'Artificial Intelligence',                       type: 'elective',  credit: 3 },
    { coursecode: 'MITE430', coursename: 'Machine Learning',                              type: 'elective',  credit: 3 },
    { coursecode: 'MITE437', coursename: 'Data Mining',                                   type: 'elective',  credit: 3 },
    { coursecode: 'MITE431', coursename: 'Big Data Analytics',                            type: 'elective',  credit: 3 },

    // Elective: Information Security Track
    { coursecode: 'MITE432', coursename: 'Cryptography and Security Mechanisms',          type: 'elective',  credit: 3 },
    { coursecode: 'MITE442', coursename: 'Network Security',                              type: 'elective',  credit: 3 },
    { coursecode: 'MITE438', coursename: 'Secured Software System',                       type: 'elective',  credit: 3 },
    { coursecode: 'MITE433', coursename: 'Cyber Security',                                type: 'elective',  credit: 3 },

    // Elective: Software Engineering Track
    { coursecode: 'MITE434', coursename: 'Software Quality Assurance and Testing',        type: 'elective',  credit: 3 },
    { coursecode: 'MITE439', coursename: 'Software Requirements Engineering and Design',  type: 'elective',  credit: 3 },
    { coursecode: 'MITE435', coursename: 'Software Design Pattern',                       type: 'elective',  credit: 3 },
    { coursecode: 'MITE441', coursename: 'Software Maintenance and Analytics',            type: 'elective',  credit: 3 },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where:  { coursecode: course.coursecode },
      update: course,
      create: course,
    });
  }

  console.log('✅ All courses inserted successfully!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());