const pageContent = document.querySelector("#pageContent");

async function fetchingData() {
  const data = await fetch("http://localhost:3000/students");
  return await data.json();
}

async function applications() {
  const application = await fetchingData();
  const stuTable = document.createElement("table");
  const tHead = document.createElement("thead");

  for (const header in application[0]) {
    const th = document.createElement("th");
    th.textContent = header;
    th.textContent = header;
    th.style.padding = "5px";
    th.style.textAlign = "start";

    th.style.background = "#DFEDFF";
    th.style.borderTop = "1px solid #c1babaff";
    th.style.borderBottom = "1px solid #c1babaff";

    tHead.append(th);
  }
  stuTable.append(tHead);
  pageContent.append(stuTable);
}
applications();
