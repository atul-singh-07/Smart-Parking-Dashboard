// Demo toggle effect
setInterval(() => {
  const slot1 = document.getElementById("slot1");

  if (slot1.classList.contains("available")) {
    slot1.classList.remove("available");
    slot1.classList.add("occupied");
    slot1.querySelector(".status").innerText = "Occupied";
  } else {
    slot1.classList.remove("occupied");
    slot1.classList.add("available");
    slot1.querySelector(".status").innerText = "Available";
  }

}, 5000);
