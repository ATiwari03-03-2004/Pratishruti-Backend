let input = document.querySelector("#password");
let checkbox = document.querySelector("#checkbox");
checkbox.addEventListener("click", function () {
  if (this.nextElementSibling.innerText === "Show Password") {
    this.style.accentColor = "black";
    this.nextElementSibling.innerText = "Hide Password";
    input.type = "text";
  } else {
    this.nextElementSibling.innerText = "Show Password";
    input.type = "password";
  }
});

let form = document.querySelector(".deleteForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value.trim().length > 0) {
    this.submit();
  } else {
    alert("Password Field cannot be empty!");
  }
});
