document.addEventListener("DOMContentLoaded", () => {

  // === 🎠 AUTO CAROUSEL LOGIC ===
  const allCarousels = document.querySelectorAll(".carousel-container");

  // Function to update carousel buttons
  allCarousels.forEach(carousel => {
    const plantRow = carousel.querySelector(".plant-row");
    const leftBtn = carousel.querySelector(".scroll-btn.left");
    const rightBtn = carousel.querySelector(".scroll-btn.right");

    const updateButtons = () => {
      const visibleCards = Array.from(plantRow.children).filter(c => c.style.display !== "none");
      if (visibleCards.length < 3) {
        leftBtn.style.display = "none";
        rightBtn.style.display = "none";
      } else {
        leftBtn.style.display = "block";
        rightBtn.style.display = "block";
      }
    };

    updateButtons();

    rightBtn.addEventListener("click", () => plantRow.scrollBy({ left: 300, behavior: "smooth" }));
    leftBtn.addEventListener("click", () => plantRow.scrollBy({ left: -300, behavior: "smooth" }));

    let autoScroll = setInterval(() => {
      plantRow.scrollBy({ left: 250, behavior: "smooth" });
      if (plantRow.scrollLeft + plantRow.clientWidth >= plantRow.scrollWidth) {
        plantRow.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 3000);

    plantRow.addEventListener("touchstart", () => clearInterval(autoScroll));
    plantRow.addEventListener("touchend", () => {
      autoScroll = setInterval(() => {
        plantRow.scrollBy({ left: 250, behavior: "smooth" });
        if (plantRow.scrollLeft + plantRow.clientWidth >= plantRow.scrollWidth) {
          plantRow.scrollTo({ left: 0, behavior: "smooth" });
        }
      }, 3000);
    });


    carousel.updateButtons = updateButtons;
  });

  // === 🪴 MODAL POPUP LOGIC ===
  const modal = document.getElementById("plantModal");
  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalUse = document.getElementById("modalUse");
  const modalHow = document.getElementById("modalHow");
  const closeBtn = document.querySelector(".close-btn");

  document.querySelectorAll(".plant-card").forEach(card => {
    card.addEventListener("click", () => {
      const imgSrc = card.querySelector("img").src;
      const name = card.querySelector("h3").textContent;
      const useText = card.querySelectorAll("p")[0]?.textContent.replace(/^Use:\s*/i, "") || "";
      const howText = card.querySelectorAll("p")[1]?.textContent.replace(/^How to use:\s*/i, "") || "";

      modalImage.src = imgSrc;
      modalName.textContent = name;
      modalUse.textContent = useText.trim();
      modalHow.textContent = howText.trim();
      modal.style.display = "flex";
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", e => {
      if (e.target === modal) modal.style.display = "none";
    });
  }

});

// === Homepage search redirect logic ===
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("homeSearchBtn");

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  });

  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    }
  });
}

// Run as soon as page loads

window.addEventListener("load", () => {
  const token = localStorage.getItem("token");

  // Allow all users (frontend demo mode)
  console.log("Frontend demo mode");
});


// ================= LOGIN / LOGOUT TOGGLE =================

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const token = localStorage.getItem("token");

// If NOT logged in → show Login
if (!token) {
  if (loginBtn) loginBtn.style.display = "inline-block";
  if (logoutBtn) logoutBtn.style.display = "none";
}

// If logged in → show Logout
if (token) {
  if (loginBtn) loginBtn.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "inline-block";
}

// Logout click
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    alert("Logged out successfully 🌿");
    window.location.href = "signin.html";
  });
}


const aiBtn = document.getElementById('aiScanner');

if (aiBtn) {
  if (!token) {
    aiBtn.disabled = true;
    aiBtn.innerText = "Login to use AI Scanner";
    aiBtn.style.opacity = "0.6";
  }

  aiBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      window.location.href = "signin.html";
      return;
    }

    const res = await fetch("http://10.87.59.99:3000/ai-scan", {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    alert(data.message);
  });
}


// ================== VOICE SEARCH LOGIC =================
const voiceBtn = document.getElementById("voiceBtn");

if (voiceBtn && searchInput && "webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.addEventListener("click", () => {
    recognition.start(); // MUST be direct
  });

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .replace(
        /\b(show|tell|give|me|about|plant|plants|medicinal|details|of|search|find)\b/g,
        ""
      )
      .trim();

    searchInput.value = spokenText;
    window.location.href = `search.html?q=${encodeURIComponent(spokenText)}`;
  };

  recognition.onerror = (e) => {
    alert("Microphone permission denied or unavailable");
    console.error(e);
  };
} else {
  console.warn("Speech recognition not supported");
}


// Dropdown toggle
const dropdown = document.querySelector(".dropdown");
const dropdownBtn = document.querySelector(".dropdown-btn");

dropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("active");
});


// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
    }
});
