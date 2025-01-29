let form = document.querySelector(".editForm");
let inputs = document.querySelectorAll("input");
let textArea = document.querySelector("textarea");

let img = document.querySelector("#img");
let absImg = document.querySelector("#absImg");
let previewImg = document.querySelector(".preview .previewImg");
let img1 = document.querySelector(".preview .previewImg img");
let previewAbsImg = document.querySelector(".preview .previewAbsImg");
let img2 = document.querySelector(".preview .previewAbsImg img");

img.addEventListener("change", (e) => {
  const file = img.files[0];
  if (file.type.startsWith("image/")) {
    img1.src = URL.createObjectURL(file);
    img1.onload = () => URL.revokeObjectURL(img1.src);
  }
});

absImg.addEventListener("change", (e) => {
  console.dir(absImg.files[0]);
  const file = absImg.files[0];
  if (file.type.startsWith("image/")) {
    img2.src = URL.createObjectURL(file);
    img2.onload = () => URL.revokeObjectURL(img2.src);
  }
});

let checkbox = document.querySelector("#checkbox");
checkbox.addEventListener("click", function () {
  if (this.nextElementSibling.innerText === "Show Password") {
    this.style.accentColor = "black";
    this.nextElementSibling.innerText = "Hide Password";
    inputs[8].type = "text";
  } else {
    this.nextElementSibling.innerText = "Show Password";
    inputs[8].type = "password";
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (
    inputs[0].value.trim().length > 0 &&
    inputs[1].value.trim().length > 0 &&
    inputs[2].value.length > 0 &&
    inputs[3].value.length > 0 &&
    inputs[4].value.length > 0 &&
    textArea.value.trim().length > 0 &&
    inputs[7].value.trim().length > 0 &&
    inputs[8].value.trim().length > 0 &&
    img1.src.length > 0 &&
    img2.src.length > 0
  ) {
    this.submit();
  } else {
    alert("Input Fields cannot be empty!");
  }
});
