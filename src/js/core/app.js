import { dummySlots } from "../data/dummyLocations.js";
import { createSlot } from "../ui/slotCard.js";
import { renderSidebar } from "../ui/sidebar.js";
import { updateCounter } from "../ui/counter.js";

const grid = document.getElementById("parkingGrid");

function render() {
  grid.innerHTML = "";
  dummySlots.forEach(slot => {
    const card = createSlot(slot);
    grid.appendChild(card);
  });

  updateCounter(dummySlots);
}

renderSidebar();
render();
