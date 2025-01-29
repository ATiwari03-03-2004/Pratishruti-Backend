let inputs = document.querySelectorAll("input");
let form = document.querySelector("form");
let checkbox = document.querySelector("#checkbox");

checkbox.addEventListener("click", function () {
    if (this.nextElementSibling.innerText === "Show Password") {
        this.nextElementSibling.innerText = "Hide Password";
        inputs[1].type = "text";
    } else {
        this.nextElementSibling.innerText = "Show Password";
        inputs[1].type = "password";
    }
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    let name = inputs[0].value;
    let password = inputs[1].value;
    if (name.trim().length === 0 || password.trim().length === 0) {
        alert("Name or Password fields cannot be empty!");
    } else {
        this.submit();
    }
});
