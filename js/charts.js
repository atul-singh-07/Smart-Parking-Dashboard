import { db } from "./firebase-config.js";
import { ref, onValue } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const ctx = document.getElementById("parkingChart");

const chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Available", "Occupied"],
    datasets: [{
      data: [0, 0]
    }]
  }
});

onValue(ref(db, "parking/slots"), snapshot => {

  let occupied = 0;
  let total = 12;

  for (let i = 1; i <= total; i++) {
    if (snapshot.exists() && snapshot.val()["slot" + i] == 1) {
      occupied++;
    }
  }

  chart.data.datasets[0].data = [total - occupied, occupied];
  chart.update();
});
