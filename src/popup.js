const form = document.getElementById("topicForm");
const titleInput = document.getElementById("title");
const linkInput = document.getElementById("link");
const topicsList = document.getElementById("topicsList");

function renderTopics(topics) {
  topicsList.innerHTML = "";
  topics.forEach((topic, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${topic.title}</strong>
      ${
        topic.link
          ? `<br><a href="${topic.link}" target="_blank">Resource</a>`
          : ""
      }
      <br><button data-index="${index}" class="deleteBtn">❌</button>
    `;
    topicsList.appendChild(li);
  });
}

function saveTopics(topics) {
  chrome.storage.local.set({ topics });
}

function loadTopics() {
  chrome.storage.local.get("topics", (data) => {
    const topics = data.topics || [];
    renderTopics(topics);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const link = linkInput.value.trim();
  if (title) {
    chrome.storage.local.get("topics", (data) => {
      const topics = data.topics || [];
      topics.push({ title, link });
      saveTopics(topics);
      renderTopics(topics);
      form.reset();
    });
  }
});

topicsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const index = +e.target.dataset.index;
    chrome.storage.local.get("topics", (data) => {
      const topics = data.topics || [];
      topics.splice(index, 1);
      saveTopics(topics);
      renderTopics(topics);
    });
  }
});

loadTopics();
