
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const postsContainer = document.getElementById("posts");
const statusText = document.getElementById("status");
const searchInput = document.getElementById("search");
const postForm = document.getElementById("postForm");
const loadBtn = document.getElementById("loadBtn");

let posts = [];

async function loadPosts() {
  statusText.textContent = "Loading posts...";
  loadBtn.disabled = true;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const data = await response.json();
    posts = data.slice(0, 20);

    displayPosts(posts);
    statusText.textContent = `Loaded ${posts.length} posts successfully.`;
  } catch (error) {
    statusText.textContent =
      "Error loading posts. Check your internet connection.";
    console.error(error);
  } finally {
    loadBtn.disabled = false;
  }
}

function displayPosts(items) {
  postsContainer.replaceChildren();

  if (items.length === 0) {
    postsContainer.textContent = "No posts found.";
    return;
  }

  items.forEach((post) => {
    const card = document.createElement("article");
    card.className = "post-card";

    const heading = document.createElement("h3");
    heading.textContent = post.title;

    const content = document.createElement("p");
    content.textContent = post.body;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Post";

    deleteButton.addEventListener("click", () => {
      deletePost(post.id);
    });

    card.append(heading, content, deleteButton);
    postsContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase().trim();

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(keyword)
  );

  displayPosts(filteredPosts);
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();

  if (!title || !body) {
    statusText.textContent = "Please fill in all fields.";
    return;
  }

  try {
    statusText.textContent = "Adding post...";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1
      })
    });

    if (!response.ok) {
      throw new Error("Failed to add post");
    }

    const newPost = await response.json();

    // JSONPlaceholder returns a simulated new post.
    posts.unshift({
      ...newPost,
      id: Date.now(),
      title,
      body
    });

    displayPosts(posts);
    postForm.reset();
    statusText.textContent =
      "Post added successfully to the current page!";
  } catch (error) {
    statusText.textContent = "Could not add post. Try again.";
    console.error(error);
  }
});

async function deletePost(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    posts = posts.filter((post) => post.id !== id);
    displayPosts(posts);

    statusText.textContent =
      "Post removed from the current page successfully.";
  } catch (error) {
    statusText.textContent = "Could not delete post. Try again.";
    console.error(error);
  }
}

loadBtn.addEventListener("click", loadPosts);

loadPosts();
