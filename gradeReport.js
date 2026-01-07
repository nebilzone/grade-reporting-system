// import { stdin as input, stdout as output } from "process";
// import readline from "readline/promises";

// const userInput = readline.createInterface({ input, output });
const insertDataBtn = document.querySelector(".inserting-data");

const course = document.querySelector(".courseNum");
const title = document.querySelector(".courseName");
const courseCodes = document.querySelector(".courseCode");
const credit = document.querySelector(".creditHours");
const score = document.querySelector(".scoreNum");
const ects = document.querySelector(".ectsNum");

const summaryResult = [];
async function readInput(inputElement) {
  return new Promise((resolve) => {
    inputElement.focus();
    inputElement.addEventListener("change", () => {
      resolve(inputElement.value);
    });
  });
}

async function wellComePageFunc() {
  const welcomeText = `
╔════════════════════════════════════════════════════════╗
║                                                        ║
║                Grade Reporting System                  ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║   # Calculate Semester GPA                             ║
║   # Calculate Cumulative GPA                           ║
║   # Real University Grade-Styling                      ║
║   # Save Input and Error Handling                      ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                Grading Scale                           ║
║    A+  (90-100)   →  4.0                               ║
║    A   (85-89)    →  4.0                               ║
║    A-  (80-84)    →  3.75                              ║
║    B+  (75-79)    →  3.5                               ║
║    B   (70-74)    →  3.0                               ║
║    B-  (65-69)    →  2.75                              ║
║    C+  (60-64)    →  2.5                               ║
║    C   (50-59)    →  2.0                               ║
║    C-  (45-49)    →  1.75                              ║
║    D   (40-44)    →  1.0                               ║
║    F   (<40)      →  0.0                               ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
`;

  // document.getElementById("welcomeBox").append(welcomeText);
}
// async function waitingFunc() {
//   await readInput(`Press Enter to Continues `);
//   console.clear();
// }
async function semesterNumberFunc() {
  const questionLabel = document.createElement("div");

  document.body.append(questionLabel);
  questionLabel.textContent = "Semester Number";
  const input = document.createElement("input");

  input.placeholder = "Enter semester Number";
  input.className = "semesterNumberInput";

  document.body.append(input);

  let semesterNumber = await readInput(input);

  while (
    isNaN(semesterNumber) ||
    semesterNumber === "" ||
    semesterNumber === null ||
    semesterNumber < 1 ||
    semesterNumber > 14
  ) {
    alert("you insert invalid input ,please insert number and greather than 1");
    semester.value = "";
    semesterNumber = await readInput(semester);
  }
  document
    .querySelector(".semesterNumberInput")
    .addEventListener("keyup", function removeEvent(event) {
      if (event.key === "Enter") {
        courseNumberFunc(semesterNumber);
        document
          .querySelector(".semesterNumberInput")
          .removeEventListener("keyup", removeEvent);
      }
    });
  return semesterNumber;
}
async function courseNumberFunc(semesterNumber) {
  const values = await semesterNumber;
  let course;
  let gpa;
  for (let arr = 0; arr < values; arr++) {
    const input = document.createElement("input");
    const questionLabel = document.createElement("div");

    document.body.append(questionLabel);
    questionLabel.textContent = `course number for Semester ${arr + 1}`;
    input.placeholder = "Enter number of course";
    document.body.append(input);
    course = await readInput(input);
    while (isNaN(course) || course < 1 || course > 9 || course === "") {
      alert(`you insert wrong  course number ,it should be above 1 `);
      course = await readInput(input);
    }
    const titleName = await courseTitleFunc(course);
    gpa = gpaCalculatorFunc(titleName);

    const cumulative = cumulativeFunc(gpa[6], gpa[7]);

    console.log(`\nSemister ${arr} GPA`);
    await displayFunc(gpa, cumulative);
  }
  await closingFunc();

  return gpa;
}
async function courseTitleFunc(courseNumber) {
  const courseCodeArr = [];
  const ectsArr = [];
  const creditArr = [];
  const marksArr = [];
  const courseNameArr = [];
  for (let course = 0; course < courseNumber; course++) {
    let input = document.createElement("input");
    let questionLabel = document.createElement("div");
    let courseTitle = document.createElement("div");

    document.body.append(questionLabel);
    document.body.append(courseTitle);
    questionLabel.textContent = `Course  ${course + 1}  `;
    input.placeholder = "Enter course title";
    courseTitle.textContent = "course title";

    document.body.append(input);
    let courseName = await readInput(input);
    let firstChar = courseName[0];
    while (
      courseName === "" ||
      courseName.length < 3 ||
      !isNaN(firstChar) ||
      !/^[a-zA-Z\s\-]+$/.test(courseName)
    ) {
      alert(
        `course title must be greather than three characters and only letter `
      );
      courseName = await readInput(input);
      firstChar = courseName[0];
    }
    courseNameArr.push(courseName);
    const courseCodeResult = await courseCode();
    courseCodeArr.push(courseCodeResult);

    const ctsResult = await ECTS();
    ectsArr.push(ctsResult);

    const credit = await creditHoursFunc();
    creditArr.push(credit);

    const marks = await marksFunc();
    marksArr.push(marks);
  }

  return [creditArr, marksArr, courseNameArr, courseCodeArr, ectsArr];
}
async function courseCode() {
  const questionLabel = document.createElement("div");
  document.body.append(questionLabel);
  questionLabel.textContent = `Course Code`;
  const input = document.createElement("input");
  input.placeholder = "Enter course code";

  input.className = "courseCodeData";
  document.body.append(input);
  let courseCode = await readInput(input);
  while (
    courseCode.length < 3 ||
    courseCode > 30 ||
    courseCode === "" ||
    !/^[a-zA-Z]+[0-9]+$/.test(courseCode)
  ) {
    alert(`you should insert formats like maths101 `);
    courseCode = await readInput(input);
  }
  return courseCode;
}
async function ECTS() {
  const questionLabel = document.createElement("div");
  document.body.append(questionLabel);
  questionLabel.textContent = `ETCS`;
  const input = document.createElement("input");
  input.placeholder = "Enter etcs";

  document.body.append(input);
  let ects = await readInput(input);
  while (isNaN(ects) || ects < 1 || ects === "") {
    alert(`ects should be number & above 1 `);
    ects = await readInput(input);
  }
  return ects;
}
async function creditHoursFunc() {
  const questionLabel = document.createElement("div");
  document.body.append(questionLabel);
  questionLabel.textContent = `CreditHours :`;
  const input = document.createElement("input");
  input.placeholder = "Enter credit Hours";

  document.body.append(input);
  let credit = await readInput(input);
  while (isNaN(credit) || credit < 1 || credit > 24 || credit === "") {
    alert(`should be number & above 1 `);
    credit = await readInput(input);
  }
  return credit;
}

async function marksFunc() {
  const questionLabel = document.createElement("div");
  document.body.append(questionLabel);
  questionLabel.textContent = `Score :`;
  const input = document.createElement("input");
  input.placeholder = "Enter Score(0-100)";
  document.body.append(input);
  let marks = await readInput(input);
  while (isNaN(marks) || marks < 1 || marks > 100 || marks === "") {
    alert(`Marks should be number & above 1 `);
    marks = await readInput(input);
  }

  switch (true) {
    case marks >= 90:
      return { grade: "A+", point: 4, score: marks };
    case marks >= 85:
      return { grade: "A", point: 4, score: marks };
    case marks >= 80:
      return { grade: "A-", point: 3.75, score: marks };
    case marks >= 75:
      return { grade: "B+", point: 3.5, score: marks };
    case marks >= 70:
      return { grade: "B", point: 3, score: marks };
    case marks >= 65:
      return { grade: "B-", point: 2.75, score: marks };
    case marks >= 60:
      return { grade: "C+", point: 2.5, score: marks };
    case marks >= 50:
      return { grade: "C", point: 2, score: marks };
    case marks >= 45:
      return { grade: "C-", point: 1.75, score: marks };
    case marks >= 40:
      return { grade: "D", point: 1, score: marks };
    default:
      return { grade: "F", point: 0, score: 0 };
  }
}

function gpaCalculatorFunc(data) {
  const filteredData = data.filter((_, index) => index < 2);
  const leftData = data.filter((_, index) => index > 1);
  //[[1,2],[{}]]
  const totalMarks = filteredData[0].reduce(
    (sum, item, index) => sum + item * filteredData[1][index].point,
    0
  );
  const totalCreditHours = filteredData[0].reduce(
    (sum, item) => sum + Number(item),
    0
  );
  const result = totalMarks / totalCreditHours;
  const gpt = filteredData[0].map(
    (item, index) => item * filteredData[1][index].point
  );
  const point = gpt.reduce((sum, item) => sum + item, 0);
  filteredData.push(gpt);
  filteredData.push(totalCreditHours);
  filteredData.push(point);
  filteredData.push(result);

  return [...leftData, ...filteredData];
}

function cumulativeFunc(...data) {
  if (summaryResult.length < 1) {
    summaryResult.push(Number(data[0]));
    summaryResult.push(Number(data[1]));
    return [data[0], data[1], data[1] / data[0]];
  }
  summaryResult[0] += data[0];
  summaryResult[1] += data[1];

  return [
    summaryResult[0],
    summaryResult[1],
    summaryResult[1] / summaryResult[0],
  ];
}
async function displayFunc(result, cumulative) {
  const totalResultObj = result[0].map((_, index) => ({
    CourseTitle: result[0][index],
    CourseCode: result[1][index],
    ECTS: Number(result[2][index]),
    CrHr: Number(result[3][index]),
    Grade: result[4][index].grade,
    Score: Number(result[4][index].score),
    GPT: result[5][index],
  }));
  const summaryObj = [
    {
      Credit: result[6],
      Points: result[7],
      SGPA: result[8],
    },
  ];
  const cumulativeObj = [
    {
      Credit: cumulative[0],
      Points: cumulative[1],
      CGPA: cumulative[2],
    },
  ];
  createTable(totalResultObj);
  // console.table(totalResultObj);
  // console.log(`\nCurrent Semester Summary`);
  // console.table(summaryObj);
  // console.log(`\nCumulative Summary`);
  // console.table(cumulativeObj);
}
function createTable(arrayObj) {
  const table = document.createElement("table");
  const tHead = document.createElement("thead");
  const tBody = document.createElement("tbody");
  const tr = document.createElement("tr");
  table.style.border = "1px solid black";

  document.body.append(table);
  table.style.width = "100%";
   table.style.borderCollapse = "collapse";

  table.append(tHead);
  table.append(tBody);
  for (let key of Object.keys(arrayObj[0])) {
    const th = document.createElement("th");
    th.style.border = "1px solid black";
    th.textContent = `${key}`;
    tr.append(th);
    tHead.append(tr);
    console.log(key);
  }
  for (let row of arrayObj) {
    const tr = document.createElement("tr");
    for (let value of Object.values(row)) {
      const td = document.createElement("td");
      tr.style.border = "1px solid black";

      td.style.border = "1px solid black";

      td.textContent = value;
      tr.append(td);
    }
    tBody.append(tr);
  }
}
// async function closingFunc() {
//   console.log(`\nAll Semesters processed successfully \n`);
//   // userInput.close();
// }
wellComePageFunc();
// await waitingFunc();
const semesterNumber = insertDataBtn.addEventListener(
  "click",
  semesterNumberFunc,
  { once: true }
);
