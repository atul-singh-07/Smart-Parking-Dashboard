import { locations } from "../../data/dummyLocations.js";
import { renderSidebar } from "../ui/sidebar.js";
import { renderMap } from "../modules/mapRenderer.js";
import { updateCounter } from "../ui/counter.js";

let currentLocation=locations[0];

function render(){
  document.getElementById("locationTitle").textContent=currentLocation.name;
  renderMap(currentLocation.slots);
  updateCounter(currentLocation.slots);
}

renderSidebar(locations,(id)=>{
  currentLocation=locations.find(l=>l.id===id);
  render();
});

render();
