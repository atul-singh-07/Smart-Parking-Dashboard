export function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = `
    <h2>Locations</h2>
    <input type="text" placeholder="Search location..." />
  `;
}
