let chatbotInput;
let chatbotMessages;

document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatbotIcon = document.getElementById("chatbot-icon");

  // Assign them here
  chatbotInput = document.getElementById("chatbot-input");
  chatbotMessages = document.getElementById("chatbot-messages");

  chatbotIcon.addEventListener("click", function () {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none";
  });

  closeBtn.addEventListener("click", function () {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex";
  });

  sendBtn.addEventListener("click", sendMessage);
  chatbotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
});

function sendMessage() {
  const userMessage = chatbotInput.value.trim();
  if (userMessage) {
    appendMessage("user", userMessage);
    chatbotInput.value = "";
    getBotResponse(userMessage);
  }
}

function getBotResponse(message) {
  fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })
    .then((res) => res.json())
    .then((data) => {
      appendMessage("bot", data.reply);
    })
    .catch((err) => {
      console.error("Chatbot error:", err);
      appendMessage("bot", "Server error. Try again later.");
    });
}

function appendMessage(sender, message) {
  const el = document.createElement("div");
  el.classList.add("message", sender);
  el.textContent = message;
  chatbotMessages.appendChild(el);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
