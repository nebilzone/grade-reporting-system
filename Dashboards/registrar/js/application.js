const pageContent = document.querySelector("#tableContainer");
const select = document.querySelector("#filterApp");
async function fetchingFunc() {
  const application = await fetch("http://localhost:3000/users");
  return await application.json();
}
async function display() {
  const application = await fetchingFunc();
  const appTable = document.createElement("table");
  const tHead = document.createElement("thead");
  let Year;
  for (const option in application) {
    if (Year == application[option].year) {
      continue;
    }
    const options = document.createElement("option");
    if (application[option].year > Year) {
      options.selected = true;
    }
    Year = application[option].year;
    options.value = Year;
    options.textContent = Year;
    select.append(options);
  }
  for (const header in application[0]) {
    if (header == "password") {
      continue;
    }
    if (header == "auth") {
      continue;
    }
    const th = document.createElement("th");
    th.textContent = header;
    th.className = "p-2 bg-[#DFEDFF]  border-b  border-[#c1babaff] text-start";

    tHead.append(th);
  }
  appTable.append(tHead);
  for (const object of application) {
    if (object.year == select.value) {
      const tr = document.createElement("tr");
      tr.className = "text-blue-950 border-b border-[#c1babaff] w-full  ";

      for (const row in object) {
        if (row == "password") {
          continue;
        }
        if (row == "auth") {
          continue;
        }
        const td = document.createElement("td");
        td.textContent = object[row];
        td.className = "text-nowrap pl-1  ";

        tr.append(td);
      }
      appTable.append(tr);
    }
  }

  select.addEventListener("change", function (e) {
    e.preventDefault();
    appTable.innerHTML = "";
    tHead.innerHTML = "";
    const selectedBatch = e.target.value;
    for (const header in application[0]) {
      if (header == "password") {
        continue;
      }
      if (header == "auth") {
        continue;
      }
      const th = document.createElement("th");
      th.textContent = header;

      th.className =
        "p-2 bg-[#DFEDFF]  border-b  border-[#c1babaff] text-start";

      tHead.append(th);
    }
    appTable.append(tHead);
    for (const object of application) {
      if (object.year == selectedBatch) {
        const tr = document.createElement("tr");
        tr.className = "text-blue-950 border-b border-[#c1babaff] w-full  ";

        for (const row in object) {
          if (row == "password") {
            continue;
          }
          if (row == "auth") {
            continue;
          }
          const td = document.createElement("td");
          td.textContent = object[row];
          td.className = "text-nowrap pl-1  ";

          tr.append(td);
        }

        appTable.append(tr);
      }
    }
  });
  appTable.style.borderCollapse = "collapse";
  appTable.append(tHead);
  pageContent.append(appTable);
}
display();
