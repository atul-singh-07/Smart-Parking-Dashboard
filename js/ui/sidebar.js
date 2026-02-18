export function renderSidebar(locations, onSelect){
  const sidebar=document.getElementById("sidebar");

  sidebar.innerHTML=`
    <h2>Locations</h2>
    <input type="text" id="search" placeholder="Search location...">
    <div id="locationList"></div>
  `;

  const list=document.getElementById("locationList");

  function renderList(filter=""){
    list.innerHTML="";
    locations
      .filter(l=>l.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach(loc=>{
        const item=document.createElement("div");
        item.textContent=loc.name;
        item.style.margin="10px 0";
        item.style.cursor="pointer";
        item.onclick=()=>onSelect(loc.id);
        list.appendChild(item);
      });
  }

  document.getElementById("search")
    .addEventListener("input",(e)=>renderList(e.target.value));

  renderList();
}
