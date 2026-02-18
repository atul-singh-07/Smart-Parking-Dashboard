import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const locationSelect = document.getElementById("locationSelect");
const availableCount = document.getElementById("availableCount");

function loadLocation(location) {

  const locationRef = ref(db, "locations/" + location);

  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    availableCount.innerText = data.availableSlots;

    updateSlot("slot1", data.slots.slot1);
    updateSlot("slot2", data.slots.slot2);
  });
}

function updateSlot(slotId, value) {
  const slot = document.getElementById(slotId);

  if (value === 1) {
    slot.className = "slot occupied";
    slot.innerHTML = "<img src='assets/car.png' width='80'>";
  } else {
    slot.className = "slot empty";
    slot.innerHTML = "";
  }
}

locationSelect.addEventListener("change", () => {
  loadLocation(locationSelect.value);
});

// Load default
loadLocation("ambience_mall");
