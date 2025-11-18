document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Participants section as a pretty bulleted list
        let participantsHTML = '';
        if (details.participants && details.participants.length > 0) {
          participantsHTML = `
            <ul class="participants-list">
              ${details.participants.map(p => `<li>${p}</li>`).join('')}
            </ul>
          `;
        } else {
          participantsHTML = '<p class="no-participants">No participants yet.</p>';
        }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-section">
            <strong>Participants:</strong>
            ${participantsHTML}
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Add styles for participants section
  const style = document.createElement('style');
  style.innerHTML = `
    .participants-section {
      margin-top: 12px;
      padding: 10px;
      background: #e3eafc;
      border-radius: 4px;
      border: 1px solid #c5cae9;
    }
    .participants-section strong {
      color: #3949ab;
      display: block;
      margin-bottom: 6px;
    }
    .participants-list {
      margin-left: 18px;
      margin-bottom: 0;
      color: #222;
      font-size: 15px;
    }
    .participants-list li {
      margin-bottom: 3px;
      list-style-type: disc;
    }
    .no-participants {
      color: #888;
      font-style: italic;
      margin: 0;
      padding-left: 2px;
    }
  `;
  document.head.appendChild(style);

  // Initialize app
  fetchActivities();
});
