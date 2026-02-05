async function fetchingStudents() {
  const response = await fetch("http://localhost:3000/students");
  const freshman = await response.json();
  return freshman.filter(
    (item) => item.track == "Natural" || item.track == "Social",
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
  let classCapacity = 5;
  let fnSection = 1;
  let fnCounter = 0;
  let fsCounter = 0;
  let fsSection = 1;

  students.forEach((element) => {
    if (element.track == "Natural"&&fnCounter<=classCapacity) {
      console.log(`${element.fullName} is FN-${fnSection}`);
      fnCounter++;
    }else if (element.track == "Natural"&&fnCounter>classCapacity){
        fnSection++;
        fnCounter=0;
    }
    if (element.track == "Social"&&fsCounter<=classCapacity) {
      console.log(`${element.fullName} is FS-${fsSection}`);
      fsCounter++;
    }else if (element.track == "Social"&&fsCounter>classCapacity){
        fsSection++;
        fsCounter=0;
    }
});
}
assigningClass();
