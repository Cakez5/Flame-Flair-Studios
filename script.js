document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name && email && message) {
      // Show success message
      const successBox = document.getElementById("formSuccess");
      if (successBox) {
        successBox.style.display = "block";
        successBox.textContent = `✅ Thanks, ${name}! We'll reply to ${email} soon.`;
      }

      // Save to localStorage
      localStorage.setItem("contactName", name);
      localStorage.setItem("contactEmail", email);
      localStorage.setItem("contactMessage", message);

      // Redirect after short delay (so user sees success message)
      setTimeout(() => {
        window.location.href = "review.html";
      }, 1500);
    } else {
      alert("Please fill out all fields.");
    }
  });

  // Object + Array example (rubric requirement)
  const games = [
    { title: "Elmentallia", genre: "RPG" },
    { title: "Prototype Quest", genre: "Adventure" }
  ];

  games.forEach(game => console.log(`${game.title} is a ${game.genre}`));
});