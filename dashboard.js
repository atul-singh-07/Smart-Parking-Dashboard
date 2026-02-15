const firebaseURL = 'https://smart-parking-system-e3686-default-rtdb.asia-southeast1.firebasedatabase.app/parking.json';

async function updateDashboard() {
  try {
    const res = await fetch(firebaseURL);
    const data = await res.json();

    const slot1 = document.getElementById("slot1");
    const slot2 = document.getElementById("slot2");

    if (data) {
      // Update Slot 1
      slot1.querySelector(".status").innerText = data.sensor1 === 1 ? "Occupied" : "Available";
      slot1.className = `slot ${data.sensor1 === 1 ? "occupied" : "available"}`;

      // Update Slot 2
      slot2.querySelector(".status").innerText = data.sensor2 === 1 ? "Occupied" : "Available";
      slot2.className = `slot ${data.sensor2 === 1 ? "occupied" : "available"}`;
    } else {
      // If Firebase returns null
      slot1.querySelector(".status").innerText = "No Data";
      slot1.className = "slot available";

      slot2.querySelector(".status").innerText = "No Data";
      slot2.className = "slot available";
    }
  } catch (err) {
    console.error("Error fetching data:", err);

    // Show error on dashboard
    const slot1 = document.getElementById("slot1");
    const slot2 = document.getElementById("slot2");

    slot1.querySelector(".status").innerText = "Error";
    slot2.querySelector(".status").innerText = "Error";
  }
}

// Initial load
updateDashboard();

// Refresh every 5 seconds
setInterval(updateDashboard, 5000);
