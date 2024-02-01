document.addEventListener("DOMContentLoaded", function () {
  const users = document.querySelectorAll(".chat-list li");
  const chatInputContainer = document.getElementById("chatInput");
  const messageDisplay = document.getElementById("messageDisplay");
  const noChatSelectedMessage = document.getElementById("no-chat-selected");
  const sendButton = document.getElementById("sendButton");
  const messageInput = document.getElementById("messageInput");
  const editUserModal = document.getElementById("editUserModal");
  const newUserNameInput = document.getElementById("newUserName");
  const newUserAvatarInput = document.getElementById("newUserAvatar");
  const userAvatarPreview = document.getElementById("userAvatarPreview");
  const closeModalButton = document.getElementById("closeModal");
  const modalBackground = document.querySelector(".modal");
  const editUserForm = document.getElementById("editUserForm");
  let currentEditingUser = null;
  const chatHeader = document.querySelector(".chat-header");

  chatInputContainer.style.display = "none";
  updateProfileHeader(null);

  users.forEach((user) => {
    user.addEventListener("click", function () {
      users.forEach((u) => u.classList.remove("active"));
      this.classList.add("active");
      updateProfileHeader(this);
      chatInputContainer.style.display = "flex";
      messageDisplay.style.display = "block";
      noChatSelectedMessage.style.display = "none";
    });
  });

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    users.forEach((user) => {
      const userName = user.querySelector(".name").textContent.toLowerCase();
      user.style.display = userName.includes(searchTerm) ? "block" : "none";
    });
  });

  messageInput.addEventListener("input", function () {
    sendButton.disabled = !this.value.trim();
  });

  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !sendButton.disabled) {
      event.preventDefault();
      sendMessage();
    }
  });

  function sendMessage() {
    const activeUser = document.querySelector(".chat-list li.active");
    if (activeUser && activeUser.dataset.blocked === "true") {
      alert("This user is blocked and cannot receive messages.");
      return;
    }

    const messageText = messageInput.value.trim();
    if (messageText) {
      const messageContainer = document.createElement("div");
      messageContainer.classList.add("message-container");
      const avatarElement = document.createElement("img");
      avatarElement.src = activeUser.querySelector("img").getAttribute("src");
      avatarElement.classList.add("message-avatar");
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", "message-mine");
      messageElement.textContent = messageText;
      messageContainer.appendChild(avatarElement);
      messageContainer.appendChild(messageElement);
      messageDisplay.appendChild(messageContainer);
      messageInput.value = "";
      sendButton.disabled = true;
      messageDisplay.scrollTop = messageDisplay.scrollHeight;
    }
  }

  const editUserButtons = document.querySelectorAll(".edit-user-button");
  editUserButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const userListItem = this.closest("li");
      const userNameElement = userListItem.querySelector(".name");
      const userAvatarImg = userListItem.querySelector("img").src;
      currentEditingUser = userListItem;
      editUser(userNameElement.textContent, userAvatarImg);
    });
  });

  function editUser(userName, userAvatar) {
    newUserNameInput.value = userName;
    userAvatarPreview.src = userAvatar;
    newUserAvatarInput.value = "";
    editUserModal.style.display = "block";
  }

  closeModalButton.addEventListener("click", () => {
    editUserModal.style.display = "none";
  });

  modalBackground.addEventListener("click", (event) => {
    if (event.target === modalBackground) {
      editUserModal.style.display = "none";
    }
  });

  newUserAvatarInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        userAvatarPreview.src = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  newUserNameInput.addEventListener("input", function () {
    const saveButton = editUserForm.querySelector('button[type="submit"]');
    saveButton.disabled = !this.value.trim();
  });

  editUserForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const newUserName = newUserNameInput.value.trim();
    const newUserAvatarFile = newUserAvatarInput.files[0];

    if (currentEditingUser) {
      if (newUserName) {
        currentEditingUser.querySelector(".name").textContent = newUserName;
        const chatHeaderName = chatHeader.querySelector(".chat-about h6");
        if (chatHeaderName) {
          chatHeaderName.textContent = newUserName;
        }
      }

      if (newUserAvatarFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const newAvatarSrc = e.target.result;
          currentEditingUser.querySelector("img").src = newAvatarSrc;
          const chatHeaderAvatar = chatHeader.querySelector(
            ".chat-header-avatar"
          );
          if (chatHeaderAvatar) {
            chatHeaderAvatar.src = newAvatarSrc;
          }
        };
        reader.readAsDataURL(newUserAvatarFile);
      }
    }

    editUserModal.style.display = "none";
  });

  function updateProfileHeader(userListItem) {
    if (userListItem) {
      const userName = userListItem.querySelector(".name").textContent;
      const userAvatarImg = userListItem.querySelector("img").src;
      chatHeader.querySelector(".chat-about h6").textContent = userName;
      chatHeader.querySelector(".chat-header-avatar").src = userAvatarImg;
      chatHeader.style.display = "block";
    } else {
      chatHeader.style.display = "none";
    }
  }

  const userActionButtons = document.querySelectorAll(".user-action-button");
  userActionButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const userListItem = this.closest("li");
      toggleUserBlockStatus(userListItem, this);
    });
  });

  function toggleUserBlockStatus(userListItem, button) {
    const userName = userListItem.querySelector(".name").textContent;
    const isBlocked = button.textContent === "Block";
    if (isBlocked) {
      console.log(`User ${userName} is blocked.`);
      button.textContent = "Unblock";
      userListItem.dataset.blocked = "true";
    } else {
      console.log(`User ${userName} is unblocked.`);
      button.textContent = "Block";
      userListItem.dataset.blocked = "false";
    }
  }
});
