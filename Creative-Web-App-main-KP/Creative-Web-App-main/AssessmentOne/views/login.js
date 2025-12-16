document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (e) => {
    //when the user tries to submit a form
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    //sends the POST request to the server at the /login route
    const res = await fetch("/login", {
      method: "POST", //tells server that I am sending data
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("loggedInUser", data.userId); // store the user ID
      window.location.href = "/notes.html"; // redirect to notes page
    } else {
      alert("Login failed!");
    }
  });
});
