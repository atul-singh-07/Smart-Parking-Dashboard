export function createSlot(slot) {
  const div = document.createElement("div");
  div.className = `slot ${slot.occupied ? "occupied" : "available"}`;

  const img = document.createElement("img");
  img.src = "../../public/assets/icons/car.svg";

  div.appendChild(img);
  return div;
}
