let selectedPlan;

function openPayment(plan){

selectedPlan = plan;

document.getElementById("paymentModal").style.display="block";

}

function payUPI(){

activatePlan(selectedPlan);

}

function payBinance(){

activatePlan(selectedPlan);

}

function activatePlan(plan){

if(plan === 500){

localStorage.setItem("coins",500);
localStorage.setItem("plan","basic");

}

else if(plan === 1500){

localStorage.setItem("coins",1800);
localStorage.setItem("plan","pro");

}

else{

localStorage.setItem("plan","unlimited");

}

alert("Plan Activated");

window.location.href="../index.html";

}
