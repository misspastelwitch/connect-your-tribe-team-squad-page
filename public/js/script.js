document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("food-search");
  const foodList = document.getElementById("food-list");
  const filterButton = document.getElementById("apply-filter");

  searchInput.addEventListener("focus", () => {
    foodList.classList.remove("hidden");
  });

  document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !foodList.contains(event.target)) {
      foodList.classList.add("hidden");
    }
  });

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();
    const items = foodList.getElementsByTagName("li");

    for (let item of items) {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(searchValue) ? "block" : "none";
    }
  });

  foodList.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
      searchInput.value = event.target.textContent;
      foodList.classList.add("hidden");
    }
  });

  filterButton.addEventListener("click", function () {
    const selectedFood = searchInput.value.trim();

    if (!selectedFood) {
      alert("Please enter or select a food type.");
      return;
    }

    if (selectedFood.toLowerCase() === "all foods") {
      window.location.href = `/`;
    } else {
      window.location.href = `/filter/${encodeURIComponent(selectedFood)}`;
    }
  });
});
