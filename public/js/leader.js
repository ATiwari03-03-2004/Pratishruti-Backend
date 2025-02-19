let trs = document.querySelectorAll("tr");

trs[1].children[0].innerHTML = `<span class='crown'><i class='fa-solid fa-crown' style='color: rgb(255, 215, 0)'></i>&nbsp;${trs[1].children[0].innerText}</span>`;

trs[2].children[0].innerHTML = `<span class='crown'><i class='fa-solid fa-crown' style='color: rgb(192,192,192)'></i>&nbsp;${trs[2].children[0].innerText}</span>`;

trs[3].children[0].innerHTML = `<span class='crown'><i class='fa-solid fa-crown' style='color: rgb(110,77,37)'></i>&nbsp;${trs[3].children[0].innerText}</span>`;

let inputs = document.querySelectorAll("input");
let updateBtn = document.querySelector(".updateBtn");
let inputArr = [...inputs];

let url = `https://admin.pratishruti25.com/updateScore/${updateBtn.classList[1]}`;

async function setScore(link) {
    const list = inputArr.map((e) => {
        return [e.id, e.value];
    });
    console.log(url, list);
    await fetch(link, {method: "POST", body: JSON.stringify(list)});
}

updateBtn.addEventListener("click", function (e) {
    console.log("demo1");
    setScore(url);
});
