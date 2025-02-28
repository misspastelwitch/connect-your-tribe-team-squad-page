document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("food-search");
  const foodList = document.getElementById("food-list");
  const resetButton = document.getElementById("reset-filter");

  searchInput.addEventListener("focus", () => {
    foodList.classList.remove("hidden");
  });

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();
    const items = foodList.getElementsByTagName("li");
    let hasResults = false;

    for (let item of items) {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchValue)) {
        item.style.display = "block";
        hasResults = true;
      } else {
        item.style.display = "none";
      }
    }

    if (hasResults) {
      foodList.classList.remove("hidden");
    } else {
      foodList.classList.add("hidden");
    }
  });

  foodList.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
      searchInput.value = event.target.dataset.value || event.target.textContent;
      foodList.classList.add("hidden");
      redirectToFilter(searchInput.value);
    }
  });

  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      redirectToFilter(searchInput.value);
    }
  });

  resetButton.addEventListener("click", function () {
    searchInput.value = "";
    foodList.classList.add("hidden");
    window.location.href = `/`;
  });

  function redirectToFilter(selectedFood) {
    const trimmedFood = selectedFood.trim().toLowerCase();

    if (!trimmedFood) {
      alert("Please enter or select a food type.");
      return;
    }

    const items = foodList.getElementsByTagName("li");
    let matchedFood = null;

    for (let item of items) {
      if (item.textContent.toLowerCase() === trimmedFood) {
        matchedFood = item.textContent;
        break;
      }
    }

    if (!matchedFood) {
      alert("No matching food found. Please select from the list.");
      return;
    }

    window.location.href = `/filter/${encodeURIComponent(matchedFood)}`;
  }

  document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !foodList.contains(event.target)) {
      foodList.classList.add("hidden");
    }
  });

  // Next Person Button
  const prevPersonButton = document.getElementById("prevPerson");
  if (prevPersonButton) {
    prevPersonButton.addEventListener("click", async function () {
      try {
        const response = await fetch("/");
        const html = await response.text();

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const newPerson = tempDiv.querySelector(".music-player");
        if (newPerson) {
          document.querySelector(".music-player").innerHTML = newPerson.innerHTML;
        }
      } catch (error) {
        console.error("Error fetching new person:", error);
      }
    });
  }
});
