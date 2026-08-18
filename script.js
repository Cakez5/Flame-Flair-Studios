document.addEventListener("DOMContentLoaded", () => {
  const studioContactEmail = window.STUDIO_CONTACT_EMAIL || "";
  const contactForm = document.getElementById("contactForm");
  const questionForm = document.getElementById("questionForm");
  const deliveryStatus = document.getElementById("deliveryStatus");

  const formatSubmittedAt = (submittedAt) => {
    if (!submittedAt) {
      return "Pending timestamp";
    }

    const date = new Date(submittedAt);
    if (Number.isNaN(date.getTime())) {
      return "Pending timestamp";
    }

    return date.toLocaleString();
  };

  const updateDeliveryStatus = () => {
    if (!deliveryStatus) {
      return;
    }

    deliveryStatus.textContent = studioContactEmail
      ? `Questions and contact messages will be sent to ${studioContactEmail}.`
      : "No studio email is configured yet. Add one in site-config.js to make submissions live.";
  };

  const submitToStudioEmail = async (form, payload) => {
    if (!studioContactEmail) {
      throw new Error("Studio email missing");
    }

    const formData = new FormData(form);
    formData.append("_subject", `Flame Flair Studios ${payload.type} submission`);
    formData.append("_template", "table");
    formData.append("_captcha", "false");
    formData.append("source", payload.source);
    formData.append("submissionType", payload.type);
    formData.append("submittedAt", payload.submittedAt);

    const response = await fetch(`https://formsubmit.co/ajax/${studioContactEmail}`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json"
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  };

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        alert("Please fill out all fields.");
        return;
      }

      const successBox = document.getElementById("formSuccess");

      try {
        await submitToStudioEmail(contactForm, {
          type: "contact",
          source: "contact-page",
          submittedAt: new Date().toISOString()
        });

        if (successBox) {
          successBox.style.display = "block";
          successBox.textContent = `Thanks, ${name}. Your message was sent successfully.`;
        }

        contactForm.reset();
      } catch (error) {
        if (successBox) {
          successBox.style.display = "block";
          successBox.textContent = studioContactEmail
            ? "Submission could not be delivered. Confirm the configured email service and try again."
            : "Submission is not connected yet. Add the email in site-config.js first.";
        }
      }
    });
  }

  if (questionForm) {
    questionForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("questionName").value.trim();
      const email = document.getElementById("questionEmail").value.trim();
      const question = document.getElementById("questionMessage").value.trim();
      const successBox = document.getElementById("questionSuccess");

      if (!name || !question) {
        alert("Please add your name and question.");
        return;
      }

      try {
        await submitToStudioEmail(questionForm, {
          type: "question",
          source: "home-page",
          submittedAt: new Date().toISOString()
        });

        if (successBox) {
          successBox.style.display = "block";
          successBox.textContent = `Question received, ${name}. It was sent successfully.`;
        }

        questionForm.reset();
      } catch (error) {
        if (successBox) {
          successBox.style.display = "block";
          successBox.textContent = studioContactEmail
            ? "Question could not be delivered. Confirm the configured email service and try again."
            : "Question submission is not connected yet. Add the email in site-config.js first.";
        }
      }
    });
  }

  updateDeliveryStatus();

  const games = [
    { title: "Elementallia: Land of Deception", genre: "RPG" },
    { title: "Prototype Quest", genre: "Adventure" }
  ];

  games.forEach((game) => console.log(`${game.title} is a ${game.genre}`));
});