async function studentData() {
  let result = await fetch("http://localhost:3000/students");
  return await result.json();
}
async function groupById() {
  let studentObj = await studentData();
  const grouped = {};
  console.log(studentObj)
  for (const student of studentObj) {
    console.log(student)
    id = student.id;
    if (!grouped[id]) {
      grouped[id] = {
        studentName: student.fullName,
        record: [],
      };
    }
    grouped[id].record.push(student);
  }
  console.log(grouped);
  return grouped;
}
async function gradeCalculator(result) {
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
  return { credit: filteredCredit[0], grade: filteredResult[0] };
}
async function gpaCalculator(result) {
  // console.log(result);
  let sum = [];
  let gpt;
  let credits;
  for (let each of result) {
    sum.push(each);
    gpt = sum.reduce(
      (acc, item, index) => (acc += item.credit * item.grade),
      0,
    );
    credits = sum.reduce((acc, item, index) => (acc += item.credit), 0);
  }
  return gpt / credits;
}
async function cumulativeGPACalculator(result) {
  let convertingArr = [];
  let totalCredit;
  let totalPoint;

  for (let cgpa of result) {
    // console.log(cgpa);
    convertingArr.push(cgpa);
    totalCredit = convertingArr.reduce((acc, item) => (acc += item.credit), 0);
    totalPoint = convertingArr.reduce(
      (acc, item) => (acc += item.credit * item.grade),
      0,
    );
  }
  return totalPoint / totalCredit;
}
async function display() {
  let showResult = await groupById();
  for (let key in showResult) {
    const cgpaResult = [];

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
        const gpaResult = [];
        const title = document.createElement("h3");
        title.textContent = `Course Details For year ${y} Semester ${z}`;
        title.style.display = "flex";
        title.style.justifyContent = "center";
        const div = document.createElement("h4");
        div.textContent = `Student Full Name : ${showResult[key].studentName} ID : ${showResult[key].record[z].StudentID}`;
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.borderTop = "1px solid #c1babaff";
        div.style.paddingTop = "10px";
        document.body.append(title);
        document.body.append(div);
        const studentTable = document.createElement("table");
        studentTable.style.borderCollapse = "collapse";
        studentTable.style.width = "100%";
        const header = document.createElement("thead");
        const keyValue = Object.keys(showResult[key].record[z]);
        const tableHead = keyValue.filter(
          (result) => result == "Course" || result == "CreditHour",
        );
        tableHead.push("Grade");
        tableHead.push("Value");
        tableHead.push("Instructor");
        tableHead.push("Action");

        for (let head of tableHead) {
          const th = document.createElement("th");
          th.style.borderBottom = "1px solid #c1babaff";
          th.style.borderTop = "1px solid #c1babaff";
          th.style.backgroundColor = "#f1f7faff";
          th.style.padding = "8px";
          th.style.textAlign = "left";
          th.textContent = head;
          header.append(th);
        }
        studentTable.append(header);
        for (let value = 0; value < showResult[key].record.length; value++) {
          const eachResult = Object.values(showResult[key].record[value]);
          if (
            showResult[key].record[value].Semester == z &&
            showResult[key].record[value].Year == y
          ) {
            const tr = document.createElement("tr");
            const filteredEachResult = eachResult.filter(
              (_, index) => index >= 4,
            );
            const dataDisplayedOnTable = filteredEachResult.filter(
              (_, index) => index == 0 || index == 4 || index == 5,
            );
            const filteredScore = filteredEachResult.slice(1, 4);
            const score = filteredScore.reduce((acc, sum) => (acc += sum), 0);
            let grade = await gradeCalculator(score);
            dataDisplayedOnTable.splice(2, 0, grade.point, grade.value);
            let gpa = await filterDataForGPA(dataDisplayedOnTable);
            gpaResult.push(gpa);
            if (
              showResult[key].record[value].Semester == z &&
              showResult[key].record[value].Year == y
            ) {
              cgpaResult.push(gpa);
            }
            dataDisplayedOnTable.push("btn");
            for (const eachRow in dataDisplayedOnTable) {
              const td = document.createElement("td");
              if (dataDisplayedOnTable[eachRow] != "btn") {
                td.textContent = dataDisplayedOnTable[eachRow];
              } else {
                const btn = document.createElement("button");
                btn.textContent = "👁 View ";
                btn.style.background = "none";
                btn.style.border = "none";
                btn.style.borderRadius = "5px";
                btn.style.padding = "2px 5px";

                btn.addEventListener("mouseenter", () => {
                  btn.style.background = "#f8dbdbff";
                });
                btn.addEventListener("mouseleave", () => {
                  btn.style.background = "none";
                });
                btn.addEventListener("click", () => {
                  console.log(filteredScore);
                  const detailsTable=document.createElement('table');
                  const tHead=document.createElement('head');
                  const th=document.createElement('th');
                });

                td.append(btn);
              }
              tr.append(td);
              td.style.borderBottom = "1px solid #c1babaff";
              td.style.borderLeft = "none";
              td.style.borderRight = "none";
              td.style.padding = "8px";
              td.style.backgroundColor =
                eachRow % 2 === 0 ? "#f2f2f2" : "#e6f7ff";
            }
            studentTable.append(tr);
          }
        }
        // console.log(gpaResult);
        let gpa = await gpaCalculator(gpaResult);
        const sgpa = document.createElement("h3");

        sgpa.textContent = `SGPA : ${gpa}`;
        sgpa.style.display = "flex";
        sgpa.style.justifyContent = "end";
        let cgpa = await cumulativeGPACalculator(cgpaResult);
        const cGPA = document.createElement("h3");
        cGPA.textContent = `CGPA : ${cgpa}`;
        cGPA.style.display = "flex";
        cGPA.style.justifyContent = "end";

        document.body.append(studentTable);
        document.body.append(sgpa);
        document.body.append(cGPA);
      }
    }
  }
}
display();
