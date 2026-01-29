const pageContent = document.querySelector(".pageContent");

async function fetchingFunc() {
  const application = await fetch("http://localhost:3000/applications");
  return await application.json();
}
async function display() {
  const application = await fetchingFunc();
  const appTable = document.createElement("table");
  const tHead = document.createElement("thead");
  let Year;
  const select = document.createElement("select");

  for (const option in application) {
    if (Year == application[option].year) {
      continue;
    }
    Year = application[option].year;
    const options = document.createElement("option");
    options.value = Year;
    options.textContent = Year;
    select.append(options);
  }
  pageContent.append(select);
  for (const header in application[0]) {
    if (header == "password") {
      continue;
    }
    const th = document.createElement("th");
    th.textContent = header;
    tHead.append(th);
  }
  appTable.append(tHead);
  pageContent.append(appTable);
}
display();
