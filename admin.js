async function studentData() {
  let result = await fetch("http://localhost:3000/students");
  return await result.json();
}

async function groupById() {
  let studentObj = await studentData();
  const grouped = {};
  for (const student of studentObj) {
    id = student.StudentID;
    if (!grouped[id]) {
      grouped[id] = {
        studentName: student.StudentName,
        record: [],
      };
    }
    grouped[id].record.push(student);
  }
  console.log(grouped);
  return grouped;
}
async function display() {
  let showResult = await groupById();
  // console.log(showResult);

  for (let key in showResult) {
    // let year=showResult[key].record.filter(student=>student.Year==1&&student.Semester==1);
    // console.log(year)
    console.log(`neba ${key}`);
    let year = Object.values(
      showResult[key].record.map((eachYear) => eachYear.Year),
    );
    let semester = Object.values(
      showResult[key].record.map((eachYear) => eachYear.Semester),
    );
    let maxYear = Math.max(...year);
    let maxSemester = Math.max(...semester);
    for (let y = 1; y <= maxYear; y++) {
      for (let z = 1; z <= maxSemester; z++) {
        const title = document.createElement("h3");
        title.textContent = `Course Details For year ${y} Semester ${z}`;
        const div = document.createElement("div");
        div.textContent = `Full Name :${showResult[key].record[z].StudentName} `;
        document.body.append(title);

        document.body.append(div);
        const studentTable = document.createElement("table");
        const header = document.createElement("thead");

        const keyValue = Object.keys(showResult[key].record[z]);
        const tableHead = keyValue.filter(
          (result) =>
            result == "Course" || result == "Score" || result == "CreditHour",
        );

        for (let head in tableHead) {
          const th = document.createElement("th");
          th.textContent = tableHead[head];
          header.append(th);
        }

        studentTable.append(header);

        for (let all = 0; all < showResult[key].record.length; all++) {
          const eachResult = Object.values(showResult[key].record[all]);
          if (showResult[key].record[all].Semester == z) {
            const tr = document.createElement("tr");

            const filteredEachResult = eachResult.filter(
              (_, index) => index > 4,
            );

            for (let eachRow in filteredEachResult) {
              const td = document.createElement("td");
              td.textContent = filteredEachResult[eachRow];
              tr.append(td);
              console.log(filteredEachResult[eachRow]);
            }

            studentTable.append(tr);
          }
        }
        console.log("semester 2");

        document.body.append(studentTable);
      }
    }
  }
}
display();
