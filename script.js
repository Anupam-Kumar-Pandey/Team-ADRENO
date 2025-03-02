document.addEventListener("DOMContentLoaded", () => {
  const ideaInput = document.getElementById("ideaInput");
  const ideasList = document.getElementById("ideasList");
  const logoutBtn = document.getElementById("logout");
  const welcomeUser = document.getElementById("welcomeUser");
  const addIdeaBtn = document.getElementById("addIdea");

  //  Check if user is logged in
  const currentUser = localStorage.getItem("currentUser");
const currentUsername = localStorage.getItem("currentUsername");

if (!currentUser || !currentUsername) {
    window.location.href = "auth.html"; // Redirect to login if not found
} else {
    document.getElementById("welcomeUser").textContent = `👤 Welcome, ${currentUsername}`;
}


  //  Logout
  logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "auth.html";
  });

  //  Add Idea
  addIdeaBtn.addEventListener("click", () => {
      const text = ideaInput.value.trim();
      if (text) {
          const newIdea = {
              id: Date.now(),
              text,
              timestamp: new Date().toLocaleString(),
              username: currentUsername,
              likes: 0,
              dislikes: 0,
              likedBy: [],
              dislikedBy: [],
              comments: [] // Store comments
          };

          let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
          ideas.push(newIdea);
          localStorage.setItem("ideas", JSON.stringify(ideas));
          renderIdeas();
          ideaInput.value = "";
      }
  });

  //  Like Idea
  window.likeIdea = function(id) {
      let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
      let idea = ideas.find(i => i.id === id);

      if (!idea) return;

      if (idea.likedBy.includes(currentUsername)) {
          idea.likes--;
          idea.likedBy = idea.likedBy.filter(user => user !== currentUsername);
      } else {
          idea.likes++;
          idea.likedBy.push(currentUsername);
          if (idea.dislikedBy.includes(currentUsername)) {
              idea.dislikes--;
              idea.dislikedBy = idea.dislikedBy.filter(user => user !== currentUsername);
          }
      }

      localStorage.setItem("ideas", JSON.stringify(ideas));
      renderIdeas();
  };

  //  Dislike Idea
  window.dislikeIdea = function(id) {
      let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
      let idea = ideas.find(i => i.id === id);

      if (!idea) return;

      if (idea.dislikedBy.includes(currentUsername)) {
          idea.dislikes--;
          idea.dislikedBy = idea.dislikedBy.filter(user => user !== currentUsername);
      } else {
          idea.dislikes++;
          idea.dislikedBy.push(currentUsername);
          if (idea.likedBy.includes(currentUsername)) {
              idea.likes--;
              idea.likedBy = idea.likedBy.filter(user => user !== currentUsername);
          }
      }

      localStorage.setItem("ideas", JSON.stringify(ideas));
      renderIdeas();
  };

  // ✏️ Edit Idea
  window.editIdea = function(id) {
      let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
      let idea = ideas.find(i => i.id === id);

      if (!idea || idea.username !== currentUsername) return;

      const newText = prompt("Edit your idea:", idea.text);
      if (newText && newText.trim() !== "") {
          idea.text = newText.trim();
          localStorage.setItem("ideas", JSON.stringify(ideas));
          renderIdeas();
      }
  };

  // Delete Idea
  window.deleteIdea = function(id) {
      let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
      let idea = ideas.find(i => i.id === id);

      if (!idea || idea.username !== currentUsername) return;

      if (confirm("Are you sure you want to delete this idea?")) {
          ideas = ideas.filter(i => i.id !== id);
          localStorage.setItem("ideas", JSON.stringify(ideas));
          renderIdeas();
      }
  };

  //  Add Comment
  window.addComment = function(id) {
      let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
      let idea = ideas.find(i => i.id === id);

      if (!idea) return;

      const commentText = prompt("Enter your comment:");
      if (commentText && commentText.trim() !== "") {
          idea.comments.push({ username: currentUsername, text: commentText.trim() });
          localStorage.setItem("ideas", JSON.stringify(ideas));
          renderIdeas();
      }
  };

  //  Render Ideas
  function renderIdeas() {
    ideasList.innerHTML = "";
    let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    ideas.forEach(idea => {
        if (!idea.comments) idea.comments = []; // Ensure comments array exists
        const ideaItem = document.createElement("div");
        ideaItem.classList.add("idea");
        ideaItem.innerHTML = `
            <p>${idea.text}</p>
            <small>Posted by <strong>${idea.username}</strong> on ${idea.timestamp}</small>
            <br>
            <button onclick="likeIdea(${idea.id})">👍 ${idea.likes}</button>
            <button onclick="dislikeIdea(${idea.id})">👎 ${idea.dislikes}</button>
            <button onclick="addComment(${idea.id})">💬 Comment</button>
            ${idea.username === currentUsername ? `
                <button onclick="editIdea(${idea.id})">✏️ Edit</button>
                <button onclick="deleteIdea(${idea.id})">🗑️ Delete</button>
            ` : ""}
            <div class="comments">
                <strong>Comments:</strong>
                ${(idea.comments || []).map(comment => `
                    <div class="comment">
                        <small><strong>${comment.username}</strong>: ${comment.text}</small>
                    </div>
                `).join('')}
            </div>
        `;
        ideasList.appendChild(ideaItem);
    });
}
renderIdeas();
});