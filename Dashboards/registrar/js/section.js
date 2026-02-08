
async function fetchingStudents() {
  const response = await fetch("http://localhost:3000/students");
  const students = await response.json();

  return students.filter(
    (s) => s.track === "Natural" || s.track === "Social"
  );
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

async function assigningClass() {
  const students = await fetchingStudents();
  shuffleArray(students);

  const classCapacity = 5;

  let fnSection = 1;
  let fsSection = 1;

  let fnCounter = 1;
  let fsCounter = 1;

  for (const student of students) {
    if (student.section) continue;

    const safeId = encodeURIComponent(student.id);

    if (student.track === "Natural") {
      await fetch(`http://localhost:3000/students/${safeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: `FN-${fnSection}` }),
      });

      console.log(`${student.fullName} → FN-${fnSection}`);



      if (fnCounter === classCapacity) {
        fnSection++;
        fnCounter = 0;
      }
      fnCounter++;
    }

    if (student.track === "Social") {
      await fetch(`http://localhost:3000/students/${safeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: `FS-${fsSection}` }),
      });

      console.log(`${student.fullName} → FS-${fsSection}`);


      if (fsCounter === classCapacity) {
        fsSection++;
        fsCounter = 0;
      }
            fsCounter++;

    }
  }

  alert(" Students assigned to sections successfully!");
}

document.getElementById("assignBtn").addEventListener("click", (e) => {
  e.preventDefault();
  assigningClass();
});
