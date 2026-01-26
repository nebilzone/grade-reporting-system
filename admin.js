

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

async function gradeCalculator(result) {
  // const filteredData = result.filter((_, index) => index == 1);
  // let avg = filteredData.reduce((acc, sum, index) => acc * sum, 1);
  switch (true) {
    case result >= 90:
      return { value: 4, point: "A+" };
    case result >= 85:
      return { value: 4, point: "A" };
    case result >= 80:
      return { value: 3.75, point: "A-" };

    case result >= 75:
      return { value: 3.5, point: "B+" };

    case result >= 70:
      return { value: 3, point: "B" };

    case result >= 65:
      return { value: 2.75, point: "B-" };

    case result >= 60:
      return { value: 2.5, point: "C+" };

    case result >= 50:
      return { value: 2, point: "C" };

    case result >= 45:
      return { value: 1.75, point: "C-" };

    case result >= 40:
      return { value: 1, point: "D" };
    case result < 40:
      return { value: 0, point: "F" };
  }
}
async function filterDataForGPA(result) {
  const filteredCredit = result.filter((_, index) => index == 1);
  const filteredResult = result.filter((_, index) => index == 3);
  // console.log(filteredCredit);
  //   console.log(filteredResult)

  return { credit: filteredCredit[0], grade: filteredResult[0] };
}
async function gpaCalculator(result) {
  let sum = [];
  let gpt;
  let credits;
  // console.log(result);
  for (let each of result) {
    // console.log(each);
    sum.push(each);
    gpt = sum.reduce(
      (acc, item, index) => (acc += item.credit * item.grade),
      0,
    );
    credits = sum.reduce((acc, item, index) => (acc += item.credit), 0);
    // console.log(credits);

    // console.log(gpt);
    // totalGpa+=gpt/credits;
  }
  // console.log(gpt/credits)
  // console.log(totalGpa)
  // console.log(sum)
  return gpt / credits;
}
async function cumulativeGPACalculator(result) {
  // console.log(result);
}
async function display() {
  let showResult = await groupById();
  // console.log(showResult);

  for (let key in showResult) {
    // let year=showResult[key].record.filter(student=>student.Year==1&&student.Semester==1);
    // console.log(year)
    // console.log(`neba ${key}`);
    let year = Object.values(
      showResult[key].record.map((eachYear) => eachYear.Year),
    );
    let semester = Object.values(
      showResult[key].record.map((eachYear) => eachYear.Semester),
    );
    let maxYear = Math.max(...year);
    // console.log(maxYear);
    // console.log("year");
    let maxSemester = Math.max(...semester);
    // console.log(maxSemester)

    for (let y = 1; y <= maxYear; y++) {
      for (let z = 1; z <= maxSemester; z++) {
        const gpaResult = [];
        // const gpaCredits = [];
        const title = document.createElement("h3");
        title.textContent = `Course Details For year ${y} Semester ${z}`;
        title.style.display='flex';
        title.style.justifyContent='center'
        const div = document.createElement("h4");
        div.textContent = `Student Full Name :${showResult[key].record[z].StudentName} `;
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.borderTop = "1px solid #c1babaff";
        div.style.paddingTop = "10px";

        document.body.append(title);

        document.body.append(div);
        const sgpa = document.createElement("h3");

        const studentTable = document.createElement("table");
        studentTable.style.borderCollapse = "collapse";
        studentTable.style.width = "100%";
        // studentTable.style.width.textAlign='left';
        //      studentTable.style.borderBottom = "2px solid #333";
        //             studentTable.style.borderLeft = "none";
        //                           studentTable.style.borderRight = "none";
        //                         studentTable.style.padding = "8px";

        const header = document.createElement("thead");

        const keyValue = Object.keys(showResult[key].record[z]);
        const tableHead = keyValue.filter(
          (result) => result == "Course" || result == "CreditHour",
        );
        tableHead.push("Grade");

        tableHead.push("Value");
        tableHead.push("Instructor");
        tableHead.push("Action");

        for (let head in tableHead) {
          const th = document.createElement("th");
          th.style.borderBottom = "1px solid #c1babaff";
          th.style.borderTop = "1px solid #c1babaff";
          th.style.backgroundColor = "#f1f7faff";
          th.style.padding = "8px";
          th.style.width.textAlign = "left";
          th.textContent = tableHead[head];
          header.append(th);
        }

        studentTable.append(header);

        for (let all = 0; all < showResult[key].record.length; all++) {
          const eachResult = Object.values(showResult[key].record[all]);
          if (
            showResult[key].record[all].Semester == z &&
            showResult[key].record[all].Year == y
          ) {
            const tr = document.createElement("tr");

            const filteredEachResult = eachResult.filter(
              (_, index) => index >= 4,
            );
            // console.log(filteredEachResult);
            const dataDisplayedOnTable = filteredEachResult.filter(
              (_, index) => index == 0 || index == 4 || index == 5,
            );
            // console.log(dataDisplayedOnTable);
            const filteredScore = filteredEachResult.slice(1, 4);
            // console.log(filteredScore);
            const score = filteredScore.reduce((acc, sum) => (acc += sum), 0);
            // console.log(score);

            // console.log("tekmata");
            let grade = await gradeCalculator(score);
            // console.log(grade);
            // filteredEachResult.push(grade.point);
            // filteredEachResult.push(grade.value);
            dataDisplayedOnTable.splice(2, 0, grade.point, grade.value);
            // console.log(dataDisplayedOnTable)

            let gpa = await filterDataForGPA(dataDisplayedOnTable);
            dataDisplayedOnTable.push("👁️");

            for (let eachRow in dataDisplayedOnTable) {
              // console.log(eachRow);
              const td = document.createElement("td");
              td.textContent = dataDisplayedOnTable[eachRow];
              tr.append(td);
              td.style.borderBottom = "1px solid #c1babaff";

              td.style.borderLeft = "none";
              td.style.borderRight = "none";
              td.style.padding = "8px";
              td.style.backgroundColor =
                eachRow % 2 === 0 ? "#f2f2f2" : "#e6f7ff";

              // console.log(filteredEachResult[eachRow]);
            }

            studentTable.append(tr);
          }
        }
        console.log(gpaResult)
        let gpa = await gpaCalculator(gpaResult);
        console.log(gpa)
        let cgpa = await cumulativeGPACalculator(gpaResult);
        // console.log(showResult[key].record);
        sgpa.textContent = `SGPA : ${gpa}`;
        // console.log(sgpa);

        document.body.append(studentTable);
        document.body.append(sgpa);
      }
    }
  }
}
display();
