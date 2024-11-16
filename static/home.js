let socket;
let username = "";
let serverName = "";
let serverCode = "";
let mode = "host";

document.getElementById("start-chat-btn").addEventListener("click", handleSetName);
document.getElementById("set-server-name-btn").addEventListener("click", handleSetServerName);
document.getElementById("join-server-btn").addEventListener("click", handleServerCodeSubmit);
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("message-input").addEventListener("keydown", handleKeyPress);
document.getElementById("host-chat-btn").addEventListener("click", () => showNameSetup("host"));
document.getElementById("join-chat-btn").addEventListener("click", () => showNameSetup("join"));

function showNameSetup(selectedMode) {
    mode = selectedMode;
    document.getElementById("chat-container").style.display = "block";
    document.querySelector(".mode-switcher").style.display = "none";
    document.getElementById("name-setup").style.display = "block";
    document.getElementById("server-name-setup").style.display = "none";
    document.getElementById("server-code-setup").style.display = "none";
    document.getElementById("chat-window").style.display = "none";
}

function handleSetName() {
    username = document.getElementById("username").value.trim();
    if (username) {
        document.getElementById("name-setup").style.display = "none";
        if (mode === "host") {
            document.getElementById("server-name-setup").style.display = "block";
        } else if (mode === "join") {
            document.getElementById("server-code-setup").style.display = "block";
        }
    } else {
        alert("Please enter your name.");
    }
}

function handleSetServerName() {
    serverName = document.getElementById("server-name").value.trim();
    if (serverName) {
        document.getElementById("server-name-setup").style.display = "none";
        initializeSocketForHost();
    } else {
        alert("Please enter a server name.");
    }
}

function handleServerCodeSubmit() {
    serverCode = document.getElementById("server-code").value.trim();
    if (serverCode) {
        document.getElementById("server-code-setup").style.display = "none";
        initializeSocketForJoin();
    } else {
        alert("Please enter a server code.");
    }
}

function initializeSocketForHost() {
    socket = io("http://localhost:9999");
    socket.on("message", (data) => displayMessage(data));
    document.getElementById("chat-header").innerText = `Server: ${serverName} - ${username}`;
    document.getElementById("chat-window").style.display = "block";
}

function initializeSocketForJoin() {
    socket = io(`http://localhost:9999/${serverCode}`);
    socket.on("message", (data) => displayMessage(data));
    document.getElementById("chat-header").innerText = `Joining Chat - ${username}`;
    document.getElementById("chat-window").style.display = "block";
}

function sendMessage() {
    const message = document.getElementById("message-input").value.trim();
    if (socket && message) {
        socket.emit("message", `${username}: ${message}`);
        displayMessage(`${username}: ${message}`);
        document.getElementById("message-input").value = "";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

document.getElementById('host-chat-btn').addEventListener('click', function() {
    document.getElementById('chat-container').style.display = 'block';
    document.querySelector('.mode-switcher').style.display = 'none';
    document.getElementById('name-setup').style.display = 'block';
});

document.getElementById('join-chat-btn').addEventListener('click', function() {
    document.getElementById('chat-container').style.display = 'block';
    document.querySelector('.mode-switcher').style.display = 'none';
    document.getElementById('server-code-setup').style.display = 'block';
});

document.getElementById('start-chat-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        document.getElementById('name-setup').style.display = 'none';
        document.getElementById('server-name-setup').style.display = 'block';
    } else {
        alert('Please enter your name!');
    }
});

    let selectedAvatar = "";

    document.querySelectorAll('.avatar').forEach(avatar => {
        avatar.addEventListener('click', function () {
            document.querySelectorAll('.avatar').forEach(a => a.classList.remove('selected'));
            this.classList.add('selected');
            selectedAvatar = this.querySelector('img').src; 
        });
    });
    document.querySelector('.boy-avatar').addEventListener('click', function() {
        avatarPath = '{% static "male.png" %}';
        selectedAvatar = avatarPath;
    });
    
    document.querySelector('.girl-avatar').addEventListener('click', function() {
        avatarPath = '{% static "male.png" %}';
        selectedAvatar = avatarPath;
    });

    document.getElementById('start-chat-btn').addEventListener('click', function () {
        const username = document.getElementById('username').value.trim();
        if (!username) {
            alert('Please enter your name!');
            return;
        }
        if (!selectedAvatar) {
            alert('Please select an avatar!');
            return;
        }
        document.getElementById('name-setup').style.display = 'none';
        document.getElementById('server-name-setup').style.display = 'block';
    });

    document.getElementById('send-btn').addEventListener('click', function () {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (!message) return;

        const username = document.getElementById('username').value.trim();
        if (username && selectedAvatar) {
            displayMessage(message, selectedAvatar, username);
            messageInput.value = ''; 
        }
    });
    function sendMessage() {
        const message = document.getElementById("message-input").value.trim();
        if (message && selectedAvatar) {
            const chatMessage = `<img src="${selectedAvatar}" alt="Avatar" style="width: 20px; height: 20px; vertical-align: middle;"> <strong>${username}:</strong> ${message}`;
            displayMessage(chatMessage);
            socket.emit("message", chatMessage);  
            document.getElementById("message-input").value = "";
        }
    }
    function displayMessage(message, avatar, username) {
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `
        <span> ${message}</span>
    `;
        messageElement.classList.add('chat-message');
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
