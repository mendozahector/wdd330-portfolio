//create an array of hikes

import Hikes from "./hikes.js";

async function getHikesList() {
  const response = await fetch("./hikes.json");

  if (response.ok) {
    let data = await response.json();
    console.log(data);
  }
}

getHikesList();

const imgBasePath = "//byui-cit.github.io/cit261/examples/";

let hikes = new Hikes("hikes");

let hikesList = hikes.getAllHikes();
console.log(hikesList);

renderHikeList(hikes.parentElement, hikesList);

function renderHikeList(parent, hikes) {
  hikes.forEach((hike) => {
    let hikeHTML = renderOneHikeLight(hike);
    parent.appendChild(hikeHTML);
  });

  let commentButtons = document.getElementsByClassName("comment-button");
  for (let i = 0; i < commentButtons.length; i++) {
    commentButtons[i].addEventListener("click", addComment);
  }

  let buttons = document.getElementsByClassName("showDetails");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", showDetails);
  }
}

function renderOneHikeLight(hike) {
  const item = document.createElement("li");
  item.innerHTML = ` <h2>${hike.name}</h2>
  <div class="imgDescContainer">
  <div class="image"><img src="${imgBasePath}${hike.imgSrc}" alt="${hike.imgAlt}"></div>
    <div>
          <div>
              <h3>Distance</h3>
              <p>${hike.distance}</p>
          </div>
          <div>
              <h3>Difficulty</h3>
              <p>${hike.difficulty}</p>
          </div>
          <div>
              <h3 class="hidden">Description</h3>
              <p class="hidden">${hike.description}</p>
          </div>
          <div>
              <h3 class="hidden">Directions</h3>
              <p class="hidden">${hike.directions}</p>
          </div>
          <div class="comments-container">
            <h3>Comments</h3>
            <textarea class="comment-input"  rows="4" cols="50"></textarea>
            <button class="comment-button">Comment</button>
            <div class="comments"></div>
          </div>
          <button class="showDetails">Show Details</button>
    </div>
  </div>`;

  return item;
}

function showDetails(event) {
  let parent = event.target.parentElement;
  let button = parent.getElementsByClassName("showDetails");

  if (button[0].textContent === "Show Details") {
    let children = parent.getElementsByClassName("hidden");

    for (let i = 0; i < children.length; ) {
      children[i].classList.add("visible");
      children[i].classList.remove("hidden");
      console.log(children);
    }

    button[0].textContent = "Hide Details";
  } else {
    let children = parent.getElementsByClassName("visible");

    for (let i = 0; i < children.length; ) {
      children[i].classList.add("hidden");
      children[i].classList.remove("visible");
      console.log(children);
    }
    button[0].textContent = "Show Details";
  }
}

function addComment(e) {
  let input = e.target.parentElement.children[1];

  let comment = document.createElement("p");
  comment.classList.add("comment");

  comment.textContent = input.value;
  input.value = "";

  let comments = e.target.parentElement.children[3];

  if (localStorage.getItem("comments")) {
    let items = localStorage.getItem("comments");
    let arr = items.split(",");

    arr.push(comment);

    arr = arr.toString();

    localStorage.setItem("comments", arr);

    let a = localStorage.getItem("comments");
  } else {
    let arr = [comment];

    let items = arr.toString();

    console.log(items);

    localStorage.setItem("comments", items);
  }
}

// //on load grab the array and insert it into the page
// window.addEventListener("load", () => {
//   showHikeList();
// });

// function showHikeList() {
//   const hikeListElement = document.getElementById("hikes");
//   hikeListElement.innerHTML = "";
//   renderHikeList(hikeList, hikeListElement);
// }

// function renderHikeList(hikes, parent) {
//   hikes.forEach((hike) => {
//     parent.appendChild(renderOneHike(hike));
//   });
// }

// function renderOneHike(hike) {
//   const item = document.createElement("li");

//   item.innerHTML = ` <h2>${hike.name}</h2>
//           <div class="image"><img src="${imgBasePath}${hike.imgSrc}" alt="${hike.imgAlt}"></div>
//           <div>
//                   <div>
//                       <h3>Distance</h3>
//                       <p>${hike.distance}</p>
//                   </div>
//                   <div>
//                       <h3>Difficulty</h3>
//                       <p>${hike.difficulty}</p>
//                   </div>
//           </div>`;

//   return item;
// }
