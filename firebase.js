import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
apiKey:"AIzaSyDPPCKJM6WQvsVFisQ5SbqBgvWuSt9AYtQ",
authDomain:"smart-parking-system-1cf2a.firebaseapp.com",  
databaseURL: "https://smart-parking-system-1cf2a-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId:"smart-parking-system-1cf2a",
storageBucket:"smart-parking-system-1cf2a.firebasestorage.app",
messagingSenderId:"1006250338223",
appId:"1:1006250338223:web:fd1d57aadeb59c4827315a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

window.register = function(){
let email=email.value;
let password=password.value;
createUserWithEmailAndPassword(auth,email,password)
.then(()=>alert("Registered Successfully"))
.catch(e=>alert(e.message));
}
import { getDatabase, ref, set }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const db = getDatabase(app);

createUserWithEmailAndPassword(auth,email,password)
.then((userCredential)=>{

const user = userCredential.user;

updateProfile(user,{
displayName:name
});

set(ref(db,"users/"+user.uid),{
name: name,
email: email,
role: "user"
});

alert("Registration Successful 🚀");
});


window.login = function(){
let email=email.value;
let password=password.value;
signInWithEmailAndPassword(auth,email,password)
.then(()=>window.location="booking.html")
.catch(e=>alert(e.message));
}

window.bookSlot = function(){
let slot=document.getElementById("slot").value;
set(ref(db,'bookings/'+slot),{
status:"Booked"
});
document.getElementById("msg").innerText="Slot Booked Successfully!";
}
import { onValue } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const parkingRef = ref(db,"locations/ambience_mall");

onValue(parkingRef,(snapshot)=>{
const data = snapshot.val();

document.getElementById("slot1").innerText = data.slots.slot1 ? "Occupied" : "Free";
document.getElementById("slot2").innerText = data.slots.slot2 ? "Occupied" : "Free";
document.getElementById("available").innerText = data.availableSlots;
});