const pageContent = document.querySelector(".pageContent");

async function fetchingFunc() {
  const application = await fetch("http://localhost:3000/users");
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
    const th = document.createElement("th");
    th.textContent = header;
    th.style.padding = "5px";
    th.style.textAlign = "start";

    th.style.background = "#DFEDFF";
    th.style.borderTop = "1px solid #c1babaff";
    th.style.borderBottom = "1px solid #c1babaff";

    tHead.append(th);
  }
  appTable.append(tHead);
  for (const object of application) {
    let rows = 0;
    if (object.year == select.value) {
      const tr = document.createElement("tr");
      for (const row in object) {
        if (row == "password") {
          continue;
        }
        const td = document.createElement("td");
        td.textContent = object[row];
        td.style.padding = "5px";

        td.style.borderBottom = "1px solid #c1babaff";

        rows % 2 == 0
          ? (td.style.background = "#f2f2f2")
          : (td.style.background = "#e6f7ff");
        tr.append(td);
        rows++;
      }
      appTable.append(tr);
    }
  }
  select.style.alignSelf = "center";
  select.style.width = "400px";
  select.style.padding = "4px";

  pageContent.append(select);
  select.addEventListener("change", function (e) {
    e.preventDefault();
    appTable.innerHTML = "";
    tHead.innerHTML = "";
    const selectedBatch = e.target.value;
    for (const header in application[0]) {
      if (header == "password") {
        continue;
      }
      const th = document.createElement("th");
      th.textContent = header;
      th.style.padding = "5px";
      th.style.textAlign = "start";

      th.style.background = "#DFEDFF";
      th.style.borderTop = "1px solid #c1babaff";
      th.style.borderBottom = "1px solid #c1babaff";

      tHead.append(th);
    }
    appTable.append(tHead);
    for (const object of application) {
      let rows = 0;

      if (object.year == selectedBatch) {
        // pageContent.innerHTML='';

        const tr = document.createElement("tr");
        for (const row in object) {
          if (row == "password") {
            continue;
          }
          const td = document.createElement("td");
          td.textContent = object[row];
          td.style.padding = "5px";

          td.style.borderBottom = "1px solid #c1babaff";
          rows % 2 == 0
            ? (td.style.background = "#f2f2f2")
            : (td.style.background = "#e6f7ff");
          rows++;
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
