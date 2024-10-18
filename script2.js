let students = [];
var linkdat = "https://script.google.com/macros/s/AKfycbxBCrkgf6fJtv3DBPWQNJR01MyGCcrXD_OMOvcujGxg9E5dFlXWMioOLJPAYFoDOJbVrQ/exec";

// Function to fetch the data
function fetchData() {
  return fetch(linkdat)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Function to process the data and assign it to the students constant
function processData(data) {
  if (data && data.data && data.data.length > 0) {
    students = data.data.map((item) => ({
      NPM: item.NPM,
      Nama: item.Nama,
      Password: item.Password,
    }));
    console.log("Students data processed: ", students);
  } else {
    console.log("No data found");
  }
}

// Function that accesses and uses the students constant
function useStudentsData() {
  console.log("Using students data in another function: ", students);

  const sec = document.getElementById("sec");

  // Clear the existing table rows
  sec.innerHTML = "";

  // Loop through each student and create a new row
  for (let i = 0; i < students.length; i++) {
    const currentCard = students[i];

    // Create a new table row for each student
    const row = document.createElement("tr");

    // Create table cells for NPM, Nama, and Password
    const npmCell = document.createElement("td");
    npmCell.textContent = currentCard.NPM;

    const namaCell = document.createElement("td");
    namaCell.textContent = currentCard.Nama;

    const pwCell = document.createElement("td");
    pwCell.textContent = currentCard.Password;

    // Create a delete button
    const btnCell = document.createElement("td"); // Use a <td> for the button cell
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus";
    deleteButton.onclick = function () {
      deleteStudent(i); // Call delete function and pass the index
    };

    // Append the button to the cell
    btnCell.appendChild(deleteButton);

    // Append the cells to the row
    row.appendChild(npmCell);
    row.appendChild(namaCell);
    row.appendChild(pwCell);
    row.appendChild(btnCell);

    // Append the row to the table body
    sec.appendChild(row);
  }
}

// Delete student function
function deleteStudent(index) {
  // Remove the student from the array
  students.splice(index, 1); // Remove 1 student at the specified index

  // Refresh the displayed data
  useStudentsData(); // Call the function to update the table
}

function deleteStudent(npm) {
  const params = new URLSearchParams();
  params.append("func", "Delete");
  params.append("NPM", npm); // Use the NPM to identify which row to delete

  // Send the delete request to the Apps Script
  fetch(linkdat, {
    // Replace with your Apps Script URL
    method: "POST",
    body: params,
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data); // Log the response from the server
      // Refresh the displayed data
      fetchData().then(processData).then(useStudentsData); // Refresh the data after deletion
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Update the button click in useStudentsData()
const deleteButton = document.createElement("button");
deleteButton.textContent = "Hapus";
deleteButton.onclick = function () {
  deleteStudent(currentCard.NPM); // Pass the NPM to delete the correct student
};

// Main function to execute when the page loads
function main() {
  const sec = document.getElementById("sec");

  // Call fetchData and process the result before rendering
  fetchData().then((data) => {
    processData(data); // Populate the students array

    // Use the function to populate the table directly
    useStudentsData(); // This updates the table

    // No need to append anything manually, as useStudentsData handles that
    document.body.append(sec);
  });
}

main(); // Call the main function to start the process
