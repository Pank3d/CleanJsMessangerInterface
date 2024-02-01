document.addEventListener("DOMContentLoaded", function () {
  function redirectToMainPage() {
    window.location.href = "main.html";
  }

  document
    .getElementById("fileInput")
    .addEventListener("change", redirectToMainPage);

  document
    .getElementById("importButton")
    .addEventListener("click", redirectToMainPage);

  document.getElementById("clearButton").addEventListener("click", function () {
    document.getElementById("fileInput").value = "";
  });
});
