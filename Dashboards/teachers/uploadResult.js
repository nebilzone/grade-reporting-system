function convertCSV() {
  const file = document.getElementById("fileInput").files[0];

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      console.log(results.data);
      document.getElementById("output").textContent =
        JSON.stringify(results.data, null, 2);
    }
  });
}
