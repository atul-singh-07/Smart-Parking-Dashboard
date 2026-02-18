export function updateCounter(slots){
  const counter=document.getElementById("counter");
  const available=slots.filter(s=>!s.occupied).length;

  counter.textContent=`Available Slots: ${available}`;
}
