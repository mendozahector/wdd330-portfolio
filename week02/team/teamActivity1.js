function sumNumbers() {
  let number = parseInt(document.querySelector("input").value);
  let result = 0;

  for (i = 1; i < number + 1; i++) {
    result += i;
  }

  document.getElementById("result").textContent = result;
}

let addNumbers = () => {
  let number1 = parseInt(document.getElementById("number1").value);
  let number2 = parseInt(document.getElementById("number2").value);

  let sum = number1 + number2;

  document.getElementById("sum").textContent = sum;
};

document.querySelector("button").addEventListener("click", sumNumbers);
document.querySelector("#add").addEventListener("click", addNumbers);
