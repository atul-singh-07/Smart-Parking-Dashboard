import { createSlot } from "../ui/slotCard.js";

export function renderMap(slots){
  const area=document.getElementById("parkingArea");
  area.innerHTML="";

  const left=document.createElement("div");
  left.className="slot-column";

  const road=document.createElement("div");
  road.className="road";

  const right=document.createElement("div");
  right.className="slot-column";

  slots.forEach((slot,index)=>{
    const card=createSlot(slot);
    if(index<4) left.appendChild(card);
    else right.appendChild(card);
  });

  area.appendChild(left);
  area.appendChild(road);
  area.appendChild(right);
}
