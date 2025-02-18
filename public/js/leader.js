let trs = document.querySelectorAll("tr");

trs[1].children[0].innerHTML = `<span class='crown'><i class='fa-solid fa-crown' style='color: rgb(255, 215, 0)'></i>&nbsp;${trs[1].children[0].innerText}</span>`;

trs[2].children[0].innerHTML = `<span class='crown'><i class='fa-solid fa-crown' style='color: rgb(192,192,192)'></i>&nbsp;${trs[2].children[0].innerText}</span>`;

trs[3].children[0].innerHTML = `<span class='crown'><i class='fa-solid fa-crown' style='color: rgb(110,77,37)'></i>&nbsp;${trs[3].children[0].innerText}</span>`;
