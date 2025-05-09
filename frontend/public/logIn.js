//Log In
const logInUserNameInput = document.querySelectorAll(".textField")[0];
const logInPasswordInput = document.querySelectorAll(".textField")[1];
const logInButtonTag = document.querySelector(".btn2");

let logInData = {
  userName: "",
  password: "",
};

logInUserNameInput.addEventListener("keyup", (e) => {
  logInData = { ...logInData, userName: e.target.value };
  console.log(logInData);
});
logInPasswordInput.addEventListener("keyup", (e) => {
  logInData = { ...logInData, password: e.target.value };
  console.log(logInData);
});

logInButtonTag.addEventListener("click", async () => {
  console.log("click");
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(logInData),
    });
    const data = await response.json();
    console.log("data", data);
    localStorage.setItem("currentUser", JSON.stringify(data));
    setTimeout(() => {
      window.location.replace(
        "/Social-media-app(Task-2)/frontend/public/home.html"
      );
    }, 3000);
  } catch (err) {
    console.log(err);
  }
});
