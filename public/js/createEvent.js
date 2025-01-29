let form = document.querySelector(".editForm");
let inputs = document.querySelectorAll("input");
let textArea = document.querySelector("textarea");
let img = document.querySelector("#img");
let absImg = document.querySelector("#absImg");
let previewImg = document.querySelector(".preview .previewImg");
let img1 = document.createElement("img");
let previewAbsImg = document.querySelector(".preview .previewAbsImg");
let img2 = document.createElement("img");

img.addEventListener("change", (e) => {
  const file = img.files[0];
  if (file.type.startsWith("image/")) {
    img1.src = URL.createObjectURL(file);
    img1.style.height = "7.5rem";
    img1.style.width = "7.5rem";
    previewImg.appendChild(img1);
    img1.onload = () => URL.revokeObjectURL(img1.src);
  }
});

absImg.addEventListener("change", (e) => {
  console.dir(absImg.files[0]);
  const file = absImg.files[0];
  if (file.type.startsWith("image/")) {
    img2.src = URL.createObjectURL(file);
    img2.style.height = "3rem";
    img2.style.width = "3rem";
    previewAbsImg.appendChild(img2);
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

async function upload(file) {
    
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (
    inputs[0].value.trim().length === 0 ||
    inputs[1].value.trim().length === 0 ||
    inputs[2].value.length === 0 ||
    inputs[3].value.length === 0 ||
    inputs[4].value.length === 0 ||
    textArea.value.trim().length === 0 ||
    inputs[5].value.trim().length === 0 ||
    inputs[6].value.trim().length === 0 ||
    inputs[7].value.trim().length === 0 ||
    inputs[8].value.trim().length === 0
  ) {
    alert("Input Fields cannot be empty!");
  } else {
    this.submit();
  }
});
