const searchDiv = document.querySelector(".pageContent");
const tableContainer = document.querySelector(".tableContainer");
async function appilications() {
  const application = await fetch("http://localhost:3000/applications");
  return await application.json();
}
async function display() {
  const application = await appilications();
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tabBtn = document.querySelector(".btnTab");
  let activeTab = "students";

  function getEthiopianYear() {
    const today = new Date();
    const gregYear = today.getFullYear();
    const month = today.getMonth(); // 0 = January
    const day = today.getDate();

    // Ethiopian New Year is September 11
    const etYear =
      month > 8 || (month === 8 && day >= 11) ? gregYear - 7 : gregYear - 8;

    return etYear;
  }
  application.sort((a, b) =>
    a.fullName
      .trim()
      .toLowerCase()
      .localeCompare(b.fullName.trim().toLowerCase()),
  );

  function renderingStudents() {
    tableContainer.innerHTML = "";
    table.innerHTML = "";
    thead.innerHTML = "";
    const ethiopianYear = getEthiopianYear();
    const idNumber = 1;
    const h3 = document.createElement("h3");
    h3.textContent = "Students applications";
    h3.style.marginLeft = "40px";

    tableContainer.append(h3);
    let conditions = true;

    for (const object of application) {
      const tr = document.createElement("tr");
      if (conditions) {
        for (const each in object) {
          const th = document.createElement("th");
          if (each == "password") {
            continue;
          }
          th.textContent = each;
          th.style.textAlign = "start";
          tr.append(th);
          th.style.padding = "5px";
          th.style.background = "#DFEDFF";
          th.style.borderTop = "1px solid #c1babaff";
        }
        const th = document.createElement("th");
        th.style.background = "#DFEDFF";
        th.style.borderTop = "1px solid #c1babaff";

        th.textContent = "action";
        th.style.textAlign = "start";

        tr.append(th);

        thead.append(tr);
      }
      conditions = false;
    }

    for (const object of application) {
      if (object.status == "Pending" && object.role == "students") {
        const tr = document.createElement("tr");
        let rows = 0;

        for (const each in object) {
          if (each == "password") {
            continue;
          }
          if (each == "documents") {
            const button = document.createElement("button");
            button.textContent = "View Documents";
            button.style.padding = "2px 9px";
            button.style.margin = "3px 9px";
            const td = document.createElement("td");
            td.style.borderBottom = "1px solid #c1babaff";
            td.style.borderTop = "1px solid #c1babaff";
            td.style.background = "#F2F2F2";

            td.append(button);
            tr.append(td);
            rows++;
            continue;
          }
          const td = document.createElement("td");
          td.textContent = object[each];
          td.style.borderBottom = "1px solid #c1babaff";
          td.style.borderTop = "1px solid #c1babaff";
          td.style.padding = "5px";

          tr.append(td);
          rows % 2 == 0
            ? (td.style.background = "#f2f2f2")
            : (td.style.background = "#e6f7ff");
          rows++;
        }
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.style.margin = "3px 15px";
        approveBtn.type = "button";
        approveBtn.style.padding = "3px 8px";
        const td = document.createElement("td");
        td.style.borderBottom = "1px solid #c1babaff";
        td.style.background = "#F2F2F2";
        approveBtn.style.backgroundColor = "#15803D";
        approveBtn.style.border = "none";
        approveBtn.style.borderRadius = "2px";
        approveBtn.style.color = "white";

        approveBtn.addEventListener("click", async function event(e) {
          e.preventDefault();
          const numberOfStudents = await fetch(
            "http://localhost:3000/students",
          );
          if (activeTab === "students") renderingStudents();
          if (activeTab === "teachers") renderingTeachers();

          const json = await numberOfStudents.json();
          const Id = json.length + 1;
          const student = {
            id: `UGPR${Id.toString().padStart(4, "0")}/${ethiopianYear}`,
            fullName: object.fullName,
            email: object.email,
            password: object.password,
            gender: object.gender,
            year: object.year,
            level: "FreshMan",
            status: "active",
          };
          await fetch("http://localhost:3000/students", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(student),
          });
          await fetch(`http://localhost:3000/applications/${object.id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ status: "approved" }),
          });
        });
        td.style.borderTop = "1px solid #c1babaff";
        td.append(approveBtn);
        const rejectBtn = document.createElement("button");
        rejectBtn.style.padding = "3px 8px";

        rejectBtn.textContent = "Reject";
        rejectBtn.style.backgroundColor = "#bc1111ff";
        rejectBtn.style.border = "none";
        rejectBtn.style.borderRadius = "2px";
        rejectBtn.style.color = "white";

        td.append(rejectBtn);
        tr.append(td);

        table.append(tr);
      }
      table.append(thead);
      table.style.borderCollapse = "collapse";
      table.style.width = "95%";
      table.style.margin = "40px";

      tableContainer.append(table);
    }
  }
  function renderingTeachers() {
    tableContainer.innerHTML = "";
    table.innerHTML = "";
    thead.innerHTML = "";
    let conditions = true;
    const h3 = document.createElement("h3");
    h3.textContent = "Teachers applications";
    h3.style.marginLeft = "40px";
    tableContainer.append(h3);
    for (const object of application) {
      if (object.role == "teachers") {
        const tr = document.createElement("tr");

        if (conditions) {
          for (const header in object) {
            if (header == "password") {
              continue;
            }
            const th = document.createElement("th");
            th.textContent = header;
            th.style.background = "#DFEDFF";
            th.style.borderTop = "1px solid #c1babaff";
            th.style.padding = "3px";

            th.style.textAlign = "start";

            tr.append(th);
          }

          conditions = false;
          const th = document.createElement("th");
          th.style.background = "#DFEDFF";
          th.style.borderTop = "1px solid #c1babaff";

          th.textContent = "action";
          th.style.padding = "4px";

          th.style.textAlign = "start";

          tr.append(th);
          thead.append(tr);
        }
      }
      table.append(thead);
    }
    tableContainer.append(table);

    for (const object of application) {
      if (object.status == "Pending" && object.role == "teachers") {
        const tr = document.createElement("tr");
        let rows = 0;

        for (const each in object) {
          if (each == "password") {
            continue;
          }
          if (each == "documents") {
            const button = document.createElement("button");
            button.textContent = "View Documents";
            button.style.padding = "2px 9px";
            button.style.margin = "3px 9px";
            const td = document.createElement("td");
            td.style.borderBottom = "1px solid #c1babaff";
            td.style.borderTop = "1px solid #c1babaff";
            td.style.background = "#F2F2F2";

            td.append(button);
            tr.append(td);
            rows++;
            continue;
          }
          const td = document.createElement("td");
          td.textContent = object[each];
          td.style.borderBottom = "1px solid #c1babaff";
          td.style.borderTop = "1px solid #c1babaff";
          td.style.padding = "5px";

          tr.append(td);
          rows % 2 == 0
            ? (td.style.background = "#f2f2f2")
            : (td.style.background = "#e6f7ff");
          rows++;
        }
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.style.margin = "3px 15px";
        approveBtn.type = "button";
        approveBtn.style.padding = "3px 8px";
        const td = document.createElement("td");
        td.style.borderBottom = "1px solid #c1babaff";
        td.style.background = "#F2F2F2";
        approveBtn.style.backgroundColor = "#15803D";
        approveBtn.style.border = "none";
        approveBtn.style.borderRadius = "2px";
        approveBtn.style.color = "white";

        approveBtn.addEventListener("click", async function event(e) {
          e.preventDefault();
          const student = {
            fullName: object.fullName,
            email: object.email,
            password: object.password,
            gender: object.gender,
            phone: object.phone,
            nationalId: object.nationalID,
            role: object.role,
            departement: object.departments,
            documents: object.documents,

            status: "active",
          };
          await fetch("http://localhost:3000/teachers", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(student),
          });
          await fetch(`http://localhost:3000/applications/${object.id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ status: "approved" }),
          });
        });
        td.style.borderTop = "1px solid #c1babaff";
        td.append(approveBtn);
        const rejectBtn = document.createElement("button");
        rejectBtn.style.padding = "3px 8px";

        rejectBtn.textContent = "Reject";
        rejectBtn.style.backgroundColor = "#bc1111ff";
        rejectBtn.style.border = "none";
        rejectBtn.style.borderRadius = "2px";
        rejectBtn.style.color = "white";

        td.append(rejectBtn);
        tr.append(td);

        table.append(tr);
      }
      table.append(thead);
      table.style.borderCollapse = "collapse";
      table.style.width = "95%";
      table.style.margin = "40px";

      tableContainer.append(table);
    }
  }
  renderingStudents();
  tabBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    const event = e.target.dataset.tab;
    activeTab = event;
    if (event == "students") renderingStudents();

    if (event == "teachers") renderingTeachers();
  });
}
display();
