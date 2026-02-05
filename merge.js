import fs from "fs";
import path from "path";
import colleges from "./data/colleges.json" assert { type: "json" };
import courses from "./data/courses.json" assert { type: "json" };
import departments from "./data/departments.json" assert { type: "json" };
import students from "./data/students.json" assert { type: "json" };
import teachers from "./data/teachers.json" assert { type: "json" };
import users from "./data/users.json" assert { type: "json" };
// Merge all JSON files into one object
const db = {
  users: users.users,
  students: students.students,
  teachers: teachers.teachers,
  colleges: colleges.colleges,
  departments: departments.departments,
  courses: courses.courses,
};

// Write merged data to db.json
fs.writeFileSync(path.join("./", "db.json"), JSON.stringify(db, null, 2));
console.log("db.json generated successfully!");
