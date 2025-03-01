document.addEventListener("DOMContentLoaded", function() {
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const messagesContainer = document.getElementById("messages");
    const chatHistory = document.getElementById("chat-history");
    const chaptersBtn = document.getElementById("chapters-btn");
    const chaptersMenu = document.getElementById("chapters-menu");
    
    let chats = JSON.parse(localStorage.getItem("chats")) || [];
    let currentChatId = null;

    // Load chat history on page load
    function loadChatHistory() {
        chatHistory.innerHTML = "";
        chats.forEach((chat, index) => {
            const chatItem = document.createElement("li");
            chatItem.textContent = chat.title;
            chatItem.addEventListener("click", () => loadChat(index));
            chatHistory.appendChild(chatItem);
        });
    }

    function loadChat(index) {
        const chat = chats[index];
        currentChatId = index;
        messagesContainer.innerHTML = "";
        chat.messages.forEach(msg => appendMessage(msg.sender, msg.text));
    }

    sendBtn.addEventListener("click", function() {
        const userText = userInput.value.trim();
        if (userText === "") return;

        // If first message, create a new chat
        if (currentChatId === null) {
            currentChatId = chats.length;
            chats.push({ title: userText.substring(0, 20) + "...", messages: [] });
        }

        const chat = chats[currentChatId];
        chat.messages.push({ sender: "You", text: userText });

        appendMessage("You", userText);
        saveChats();

        // Simulate LLM Response
        setTimeout(() => {
            const response = "This is an AI-generated response.";
            chat.messages.push({ sender: "IgrisGPT", text: response });
            appendMessage("IgrisGPT", response);
            saveChats();
        }, 1000);

        userInput.value = "";
    });

    function appendMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function saveChats() {
        localStorage.setItem("chats", JSON.stringify(chats));
        loadChatHistory();
    }

    // Dynamic Chapters List
    const chapters = ["Introduction", "Fundamentals", "Advanced Concepts"];
    chaptersMenu.innerHTML = "";
    chapters.forEach(chapter => {
        const chapterItem = document.createElement("li");
        chapterItem.textContent = chapter;
        chaptersMenu.appendChild(chapterItem);
    });

    // Toggle Chapters Drop-up
    chaptersBtn.addEventListener("click", function() {
        chaptersMenu.style.display = chaptersMenu.style.display === "block" ? "none" : "block";
    });

    // Close the drop-up when clicking outside
    document.addEventListener("click", function(event) {
        if (!chaptersBtn.contains(event.target) && !chaptersMenu.contains(event.target)) {
            chaptersMenu.style.display = "none";
        }
    });

    // Initialize
    loadChatHistory();
});
