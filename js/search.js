document.addEventListener("DOMContentLoaded", async () => {
    const searchResults = document.getElementById("searchResults");
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.toLowerCase() || "";



    const plants = [
  {
    name: "Aloe Vera",
    use: "Treats skin burns",
    how_to_use: "Apply gel directly",
    image_url: "images/aloe vera.jpg"
  },
  {
    name: "Neem",
    use: "Purifies blood",
    how_to_use: "Chew leaves",
    image_url: "images/neem.jpg"
  },
  {
    name: "Tulsi",
    use: "Boosts immunity",
    how_to_use: "Drink tea",
    image_url: "images/Tulsi.jpg"
  }
];

    try {
        
        const filteredPlants = plants.filter(plant => 
            plant.name.toLowerCase().includes(query) || 
            plant.use.toLowerCase().includes(query)
        );

        if (filteredPlants.length === 0) {
            searchResults.innerHTML = `<p id="noResults">No results found 🌿</p>`;
        } else {
            searchResults.innerHTML = "";
            filteredPlants.forEach(plant => {
                const card = document.createElement("div");
                card.className = "plant-card";
                card.innerHTML = `
                    <img src="${plant.image_url || 'images/default.jpg'}" alt="${plant.name}">
                    <h3>${plant.name}</h3>
                    <p><strong>Use:</strong> ${plant.use}</p>
                    <p><strong>How to use:</strong> ${plant.how_to_use}</p>
                `;
                searchResults.appendChild(card);

                // 🌿 Modal click
                card.addEventListener("click", () => {
                    const modal = document.getElementById("plantModal");
                    const modalImage = document.getElementById("modalImage");
                    const modalName = document.getElementById("modalName");
                    const modalUse = document.getElementById("modalUse");
                    const modalHow = document.getElementById("modalHow");

                    modalImage.src = plant.image_url || 'images/default.jpg';
                    modalName.textContent = plant.name;
                    modalUse.textContent = plant.use;
                    modalHow.textContent = plant.how_to_use;
                    modal.style.display = "flex";
                });
            });
        }
    } catch (err) {
        searchResults.innerHTML = `<p id="noResults">Failed to load plants 😔</p>`;
        console.error(err);
    }

    // === 🪴 Modal close logic ===
    const modal = document.getElementById("plantModal");
    const closeBtn = document.querySelector(".close-btn");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => modal.style.display = "none");
        window.addEventListener("click", e => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    // === ⌨️ BACKSPACE TO GO HOME ===
    document.addEventListener("keydown", e => {
        if (e.key === "Backspace" && !e.target.matches("input, textarea")) {
            e.preventDefault();
            // Redirect to homepage and pass the query for refocus
            window.location.href = "index.html?focus=search";
        }
    });
});

