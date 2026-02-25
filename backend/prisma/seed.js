// const prisma = require("./prismaClient");

// const main = async () => {
// 	const courses = [
// 		{
// 			coursecode: "MITM 303",
// 			coursename: "Advanced Computer Networks & Internetworking",
// 			type: "Major",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITM 304",
// 			coursename: "Database Architecture and Administration",
// 			type: "Major",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITM 310",
// 			coursename: "Advanced Data Structures and Algorithms",
// 			type: "Major",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITM 311",
// 			coursename: "Advanced Object-Oriented Programming",
// 			type: "Major",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITM 301",
// 			coursename: "IT Project Management",
// 			type: "Major",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITM 305",
// 			coursename: "Web Technology and Internet Computing",
// 			type: "Major",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITM 421",
// 			coursename: "Project for MIT/Internship",
// 			type: "Major",
// 			credit: 6,
// 		},
// 		{
// 			coursecode: "MITE 436",
// 			coursename: "Artificial Intelligence",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 430",
// 			coursename: "Machine Learning",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 437",
// 			coursename: "Data Mining",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 431",
// 			coursename: "Big Data Analytic",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 432",
// 			coursename: "Cryptography and Security Mechanisms",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 442",
// 			coursename: "Network Security",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 438",
// 			coursename: "Secured Software System",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 433",
// 			coursename: "Cyber Security",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 434",
// 			coursename: "Software Quality Assurance and Testing",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 439",
// 			coursename: "Software Requirements Engineering and Design",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 435",
// 			coursename: "Software Maintenance and Analytics",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 		{
// 			coursecode: "MITE 441",
// 			coursename: "Software Design Pattern",
// 			type: "Elective",
// 			credit: 3,
// 		},
// 	];

// 	for (const course of courses) {
// 		await prisma.course.create({
// 			data: course,
// 		});
// 	}

// 	console.log("Courses seeded successfully");

// 	const students = [
// 		{
// 			registration_number: "1312",
// 			email: "a@b.c",
// 			session: "2020-21",
// 			name: "Jerin",
// 		},
// 		{
// 			registration_number: "1305",
// 			email: "d@e.f",
// 			session: "2020-21",
// 			name: "Faria",
// 		},
// 	];

// 	for (const student of students) {
// 		await prisma.student.create({
// 			data: student,
// 		});
// 	}

// 	console.log("Students seeded successfully");

// }
	

// main()
// 	.catch((e) => {
// 		console.error(e);
// 		process.exit(1);
// 	})
// 	.finally(async () => {
// 		await prisma.$disconnect();
// 	});
