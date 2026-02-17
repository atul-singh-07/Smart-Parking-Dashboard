import { db } from "./firebase-config.js";
import { ref, onValue } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const grid = document.getElementById("parkingGrid");

let totalSlots = 12;

for (let i = 1; i <= totalSlots; i++) {
  const slot = document.createElement("div");
  slot.className = "slot";
  slot.id = "slot" + i;
  slot.innerText = "Slot " + i;
  grid.appendChild(slot);
}

onValue(ref(db, "parking/slots"), snapshot => {

  let available = totalSlots;

  for (let i = 1; i <= totalSlots; i++) {
    const slotDiv = document.getElementById("slot" + i);
    let occupied = 0;

    if (snapshot.exists() && snapshot.val()["slot" + i] !== undefined) {
      occupied = snapshot.val()["slot" + i];
    } else {
      occupied = Math.random() > 0.7 ? 1 : 0;
    }

    if (occupied == 1) {
      slotDiv.classList.add("occupied");
      available--;
    } else {
      slotDiv.classList.remove("occupied");
    }
  }

  document.getElementById("availableSlots").innerText = available;
});
