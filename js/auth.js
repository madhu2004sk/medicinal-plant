async function signup() {
    alert("Signup disabled (demo mode)");
}

async function signin() {
    alert("Login disabled (demo mode)");
}

// ================= ENTER KEY SUPPORT (NO HTML CHANGE) =================
document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const nameInput = document.getElementById("name");

    // If focus is inside auth inputs only
    if (
        document.activeElement === emailInput ||
        document.activeElement === passwordInput ||
        document.activeElement === nameInput
    ) {
        // Signup page (name field exists)
        if (nameInput) {
            signup();
        }
        // Signin page
        else {
            signin();
        }
    }
});
