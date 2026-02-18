export function updateCounter(slots) {
  const counter = document.getElementById("slotCounter");
  const available = slots.filter(s => !s.occupied).length;

  counter.innerHTML = `
    <span>Available: ${available}</span>
  `;
}
