let loggedIn = false;

function handleCredentialResponse(response) {

    const data = parseJwt(response.credential);

    localStorage.setItem("userEmail", data.email);
    loggedIn = true;

    alert("Welcome " + data.name);
}

function parseJwt(token) {
var base64Url = token.split('.')[1];
var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
}).join(''));

return JSON.parse(jsonPayload);
}

function checkLogin(){

if(!localStorage.getItem("userEmail")){
alert("Login with Google first");
document.getElementById("loginBtn").click();
return false;
}

}