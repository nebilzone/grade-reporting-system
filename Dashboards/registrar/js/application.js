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
  tHead.className =
    "bg-blue-100 text-blue-950 dark:bg-[#3F4554] dark:text-gray-200 text-start ";
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
    th.className = "p-2";

    tHead.append(th);
  }
  appTable.append(tHead);
  for (const object of application) {
    if (object.year == select.value) {
      const tr = document.createElement("tr");
      tr.className =
        "border-b border-[#c1babaff] w-full bg-[#f3f4f6] dark:bg-[#444B5A] dark:text-gray-300 p-2 ";

      for (const row in object) {
        if (row == "password") {
          continue;
        }
        if (row == "auth") {
          continue;
        }
        const td = document.createElement("td");
        td.textContent = object[row];
        td.className = "text-nowrap  p-2  ";

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
      th.className="p-2"
      th.textContent = header;

      tHead.append(th);
    }
    appTable.append(tHead);
    for (const object of application) {
      if (object.year == selectedBatch) {
        const tr = document.createElement("tr");
        tr.className =
          "border-b border-[#c1babaff] w-full bg-[#f3f4f6] dark:bg-[#444B5A] dark:text-gray-300 p-2 ";

        for (const row in object) {
          if (row == "password") {
            continue;
          }
          if (row == "auth") {
            continue;
          }
          const td = document.createElement("td");
          td.textContent = object[row];
          td.className = "text-nowrap  p-2  ";

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
