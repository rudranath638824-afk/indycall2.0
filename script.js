let callInterval;
let seconds = 0;
let activeInput = "targetNumber";

// --- STARTUP LOGIC ---
window.onload = () => {
    // Initialize Google OAuth programmatically to prevent "Missing client_id" errors
    google.accounts.id.initialize({
        client_id: "736271030289-cju2otol90qc96h6cflik6timp1g87ui.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    // Render the button automatically into the div
    google.accounts.id.renderButton(
        document.querySelector(".g_id_signin"),
        { theme: "outline", size: "large" } 
    );

    updateUI();
    loadCoins();
    loadHistory();
};

// --- DYNAMIC UI TOGGLE ---
function updateUI() {
    const isLogged = localStorage.getItem("userLogged") === "true";
    const name = localStorage.getItem("userName");

    const loggedInDiv = document.getElementById("loggedInHeader");
    const loggedOutDiv = document.getElementById("loggedOutHeader");

    if (isLogged) {
        if (loggedOutDiv) loggedOutDiv.style.display = "none";
        if (loggedInDiv) loggedInDiv.style.display = "block";
        document.getElementById("userNameDisplay").innerText = "Hi, " + name;
    } else {
        if (loggedOutDiv) loggedOutDiv.style.display = "block";
        if (loggedInDiv) loggedInDiv.style.display = "none";
    }
}

// --- GOOGLE AUTH HANDLER ---
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    
    // Save to memory
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userName", responsePayload.name);
    
    // Refresh UI immediately
    updateUI();
    loadCoins();
    alert("Welcome " + responsePayload.name);
}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

function logout() {
    localStorage.removeItem("userLogged");
    localStorage.removeItem("userName");
    // Also sign out from Google session
    google.accounts.id.disableAutoSelect();
    window.location.reload(); 
}

// --- DATA LOADING ---
function loadCoins() {
    let coins = localStorage.getItem("coins") || 0;
    let plan = localStorage.getItem("plan");
    const display = document.getElementById("coinBalance");
    
    if (plan === "unlimited") {
        display.innerText = "Unlimited";
    } else {
        display.innerText = coins;
    }
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let list = document.getElementById("historyList");
    if (!list) return;
    
    list.innerHTML = "";
    // Show last 5 calls
    history.slice(-5).reverse().forEach(num => {
        let li = document.createElement("li");
        li.innerText = "📞 " + num;
        list.appendChild(li);
    });
}

// --- CALLING LOGIC ---
function checkLogin() {
    if (localStorage.getItem("userLogged") !== "true") {
        alert("Please login with Google first.");
        return false;
    }
    return true;
}

function addNumber(num) {
    document.getElementById(activeInput).value += num;
}

function makeCall() {
    if (!checkLogin()) return;

    const target = document.getElementById("targetNumber").value;
    let coins = parseInt(localStorage.getItem("coins") || 0);
    let plan = localStorage.getItem("plan");

    if (target.length < 5) {
        alert("Enter valid number");
        return;
    }

    if (plan !== "unlimited" && coins < 100) {
        alert("Insufficient coins (100 required)");
        window.location.href = "pages/shop.html";
        return;
    }

    // Show Overlay
    document.getElementById("callOverlay").style.display = "flex";
    document.getElementById("callingNumber").innerText = target;

    // Simulate Connection
    setTimeout(() => {
        document.getElementById("callingStatus").innerText = "Connected";
        startTimer();

        // Deduct Coins
        if (plan !== "unlimited") {
            coins -= 100;
            localStorage.setItem("coins", coins);
            document.getElementById("coinBalance").innerText = coins;
        }

        // Save to History
        let history = JSON.parse(localStorage.getItem("history")) || [];
        history.push(target);
        localStorage.setItem("history", JSON.stringify(history));
        loadHistory();
    }, 3000);
}

function startTimer() {
    seconds = 0;
    callInterval = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        document.getElementById("callTimer").innerText = 
            (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
    }, 1000);
}

function endCall() {
    clearInterval(callInterval);
    document.getElementById("callOverlay").style.display = "none";
    document.getElementById("callTimer").innerText = "00:00";
    document.getElementById("callingStatus").innerText = "Calling...";
}
