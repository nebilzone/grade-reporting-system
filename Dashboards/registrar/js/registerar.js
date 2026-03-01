const searchDiv = document.querySelector("#pageContent");
const tableContainer = document.querySelector("#tableContainer");
async function appilications() {
  const application = await fetch("http://localhost:3000/users");
  return await application.json();
}
async function display() {
  const application = await appilications();
  const table = document.createElement("table");
  table.className = "w-full";
  const thead = document.createElement("thead");
  const tabBtn = document.querySelector("#btnTab");
  let activeTab = "students";

  function getEthiopianYear() {
    const today = new Date();
    const gregYear = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

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

    const h3 = document.createElement("h3");
    h3.textContent = "Students applications";
    h3.style.marginLeft = "40px";

    tableContainer.append(h3);
    let conditions = true;

    for (const object of application) {
      if (object.status == "Pending" && object.role == "students") {
        const tr = document.createElement("tr");
        tr.className = "bg-blue-100 text-blue-950";
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
            th.style.borderTop = "1px solid #c1babaff";
          }
          const th = document.createElement("th");
          th.style.borderTop = "1px solid #c1babaff";

          th.textContent = "action";
          th.style.textAlign = "start";

          tr.append(th);

          thead.append(tr);
        }
        conditions = false;
      }
    }

    for (const object of application) {
      if (object.status == "Pending" && object.role == "students") {
        const tr = document.createElement("tr");
        tr.className = "border-b border-[#c1babaff] w-full bg-[#f3f4f6] ";
        for (const each in object) {
          if (each == "password") {
            continue;
          }
          if (each == "documents") {
            const button = document.createElement("button");
            button.textContent = "View Docs";
            button.className =
              "bg-red-100 px-2 py-1 mx-2  rounded-sm text-nowrap";
            const td = document.createElement("td");


            td.append(button);
            tr.append(td);
            continue;
          }
          const td = document.createElement("td");
          td.textContent = object[each];
          td.className = "p-2 text-nowrap";

          tr.append(td);
        }
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";

        const td = document.createElement("td");
        td.className = "p-2 text-nowrap";

        approveBtn.className =
          "px-3 py-1 bg-[#15803D] mr-2 rounded-sm text-stone-50";


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
            batch: object.year,
            level: "FreshMan",
            year: 1,
            semester: 1,
            status: "active",
          };

          await fetch("http://localhost:5000/api/send-approval", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: object.fullName,
              email: object.email,
              password: object.password,
              studentId: `UGPR${Id.toString().padStart(4, "0")}/${ethiopianYear % 100}`,
            }),
          });

          await fetch("http://localhost:3000/students", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(student),
          });
          await fetch(`http://localhost:3000/users/${object.id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ status: "active" }),
          });
        });
        td.style.borderTop = "1px solid #c1babaff";
        td.append(approveBtn);
        const rejectBtn = document.createElement("button");
        rejectBtn.className =
          "px-3 py-1 bg-[#bc1111ff] rounded-sm text-stone-50";
        rejectBtn.textContent = "Reject";

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
    const h3 = document.createElement("h3");
    h3.textContent = "Teachers applications";
    h3.style.marginLeft = "40px";
    tableContainer.append(h3);
    let conditions = true;

    for (const object of application) {
      if (object.status == "Pending" && object.role == "teachers") {
        const tr = document.createElement("tr");
        tr.className = "bg-blue-100 text-blue-950";
        if (conditions) {
          for (const each in object) {
            const th = document.createElement("th");
            if (each == "password") {
              continue;
            }
              if (each == "auth") {
              continue;
            }
             if (each == "id") {
              continue;
            }
            th.textContent = each;
            th.className="p-2 border-t border-[#c1babaff] text-start"
            tr.append(th);

          }
          const th = document.createElement("th");
          th.style.borderTop = "1px solid #c1babaff";

          th.textContent = "action";
          th.style.textAlign = "start";

          tr.append(th);

          thead.append(tr);
        }
        conditions = false;
      }
    }
    table.append(thead);
    tableContainer.append(table);

    for (const object of application) {
      if (object.status == "Pending" && object.role == "teachers") {
        const tr = document.createElement("tr");

        for (const each in object) {
          if (each == "password") {
            continue;
          }
           if (each == "auth") {
              continue;
            }
              if (each == "id") {
              continue;
            }
          if (each == "documents") {
            const button = document.createElement("button");
            button.textContent = "View";
            button.className =
              "bg-red-100 px-2 py-1 mx-2  rounded-sm text-nowrap";

            const td = document.createElement("td");

            td.className="border-y border-y-[#F2F2F2]"

            td.append(button);
            tr.append(td);
            continue;
          }
          const td = document.createElement("td");
          td.textContent = object[each];
          td.style.borderBottom = "1px solid #c1babaff";
          td.style.borderTop = "1px solid #c1babaff";
          td.style.padding = "5px";

          tr.append(td);
        }
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
         approveBtn.className =
          "px-3 py-1 bg-[#15803D] mr-2 rounded-sm text-stone-50";

        const td = document.createElement("td");
        td.style.borderBottom = "1px solid #c1babaff";
        td.style.background = "#F2F2F2";


        approveBtn.addEventListener("click", async function event(e) {
          e.preventDefault();
          const student = {
            fullName: object.fullName,
            email: object.email,
            password: object.password,

            gender: object.gender,
            phone: object.phone,
            nationalId: object.nationalID,
            departement: object.departments,
            documents: object.documents,

            status: "active",
          };
          await fetch("http://localhost:5000/api/send-approval", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: object.fullName,
              email: object.email,
              password: object.password,
            }),
          });

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

        rejectBtn.textContent = "Reject";
           rejectBtn.className =
          "px-3 py-1 bg-[#bc1111ff] rounded-sm text-stone-50";

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
