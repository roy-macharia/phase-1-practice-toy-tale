let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetchToys();
  setupFormListener();
});

const toyCollection = document.getElementById("toy-collection");

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      toys.forEach(renderToyCard);
    });
}

function renderToyCard(toy) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Like button listener
  const likeBtn = card.querySelector("button.like-btn");
  likeBtn.addEventListener("click", () => handleLike(toy, card));

  toyCollection.appendChild(card);
  
}

function setupFormListener() {
  const form = document.querySelector(".add-toy-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(res => res.json())
      .then(toy => renderToyCard(toy));

    form.reset(); // Clear form inputs
  });
}

function handleLike(toy, card) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
    .then(res => res.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes; // update local copy
      const likesP = card.querySelector("p");
      likesP.textContent = `${updatedToy.likes} Likes`;
    });
}