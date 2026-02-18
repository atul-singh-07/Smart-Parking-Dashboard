export function createSlot(slot){
  const div=document.createElement("div");
  div.className=`slot ${slot.occupied?"occupied":"available"}`;

  if(slot.occupied){
    const img=document.createElement("img");
    img.src="assets/icons/car.svg";
    div.appendChild(img);
  }

  return div;
}
