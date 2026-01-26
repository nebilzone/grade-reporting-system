const gradeMap = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  F: 0
};

async function loadGrades() {
  const res = await fetch("http://localhost:3000/courses");
  const courses = await res.json();

  let totalPoints = 0;
  let totalCredits = 0;

  for (let c of courses) {
    totalPoints += gradeMap[c.grade] * c.credit;
    totalCredits += c.credit;
  }

  const gpa = (totalPoints / totalCredits).toFixed(2);

  document.getElementById("result").innerHTML = `
    <p>Total Credits: ${totalCredits}</p>
    <p>GPA: ${gpa}</p>
  `;
}

loadGrades();
