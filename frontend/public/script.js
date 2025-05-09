//Registor
const userNameInput = document.querySelectorAll(".textField")[0];
const emailInput = document.querySelectorAll(".textField")[1];
const passwordInput = document.querySelectorAll(".textField")[2];
const nameInput = document.querySelectorAll(".textField")[3];
const buttonTag = document.querySelector(".btn");
const errorTag = document.querySelector(".error");

let registorData = {
  userName: "",
  email: "",
  password: "",
  name: "",
};

userNameInput.addEventListener("keyup", (e) => {
  registorData = { ...registorData, userName: e.target.value };
  console.log(registorData);
});
emailInput.addEventListener("keyup", (e) => {
  registorData = { ...registorData, email: e.target.value };
  console.log(registorData);
});
passwordInput.addEventListener("keyup", (e) => {
  registorData = { ...registorData, password: e.target.value };
  console.log(registorData);
});
nameInput.addEventListener("keyup", (e) => {
  registorData = { ...registorData, name: e.target.value };
  console.log(registorData);
});

console.log(buttonTag);
buttonTag.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registorData),
    });
    const data = await response.json();
    console.log("data", data);
    window.location.replace(
      "/Social-media-app(Task-2)/frontend/public/logIn.html"
    );
  } catch (err) {
    console.log(err);
    errorTag.innerHTML = err.response.data;
  }
});
