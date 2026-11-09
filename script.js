// ChargeEase v2 - data, search, Google Maps, calculator, booking, payment & UI
const stations = [
  [1, "GreenCharge Central", "Anna Salai, Teynampet", "CCS2", 60, 18, "available"],
  [2, "EcoVolt Hub", "Velachery Main Road, Velachery", "Type 2", 22, 14, "occupied"],
  [3, "PowerPoint EV", "Guindy Industrial Estate, Guindy", "CCS2", 120, 20, "available"],
  [4, "Marina Charge Hub", "Triplicane High Road, Triplicane", "Type 2", 22, 15, "available"],
  [5, "OMR Green Energy", "Rajiv Gandhi Salai, Sholinganallur", "CCS2", 60, 18, "occupied"],
  [6, "Anna Nagar EV Point", "2nd Avenue, Anna Nagar", "Type 2", 22, 14, "available"],
  [7, "Tambaram Power Hub", "GST Road, Tambaram", "CCS2", 60, 17, "available"],
  [8, "Adyar EcoCharge", "LB Road, Adyar", "Type 2", 22, 15, "occupied"],
  [9, "Porur Fast Charge", "Mount Poonamallee Road, Porur", "CCS2", 120, 20, "available"],
  [10, "T Nagar Charging Point", "Usman Road, T Nagar", "Type 2", 22, 16, "available"]
].map(([id, name, address, connector, power, price, status]) =>
  ({ id, name, address, connector, power, price, status, city: "Chennai" }));

const $ = id => document.getElementById(id);
const img = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const q = s => encodeURIComponent(`${s.name} ${s.address} Chennai`);
const mapLink = s => `https://www.google.com/maps/search/?api=1&query=${q(s)}`;
const dirLink = s => `https://www.google.com/maps/dir/?api=1&destination=${q(s)}`;
const embed = text => `https://maps.google.com/maps?q=${encodeURIComponent(text)}&z=14&output=embed`;
const loadBookings = () => JSON.parse(localStorage.getItem("chargeEaseBookings") || "[]");
const saveBookings = l => localStorage.setItem("chargeEaseBookings", JSON.stringify(l));
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ---------- Scroll reveal ---------- */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const io = "IntersectionObserver" in window && !reduce ? new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  io.unobserve(e.target);
  setTimeout(() => e.target.classList.remove("reveal", "in"), 1000);
}), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }) : null;
const reveal = els => io && els.forEach((el, i) => {
  el.style.setProperty("--d", `${(i % 3) * 0.08}s`);
  el.classList.add("reveal");
  io.observe(el);
});

/* ---------- Static content blocks ---------- */
$("marquee").innerHTML = [..."12"].map(() =>
  ["⚡ CCS2 fast charging", "Type 2 AC charging", "24/7 open access", "Live availability", "Google Maps directions", "Instant demo booking"]
    .map(t => `<span>${t}</span>`).join("")).join("");

$("steps").innerHTML = [
  ["Find", "Explore charging stations and their connectors.", "ev-find"],
  ["Choose", "Compare charger power, prices and availability.", "ev-choose"],
  ["Book", "Select a time slot and reserve your charger.", "ev-book"]
].map(([t, p, seed], i) => `<article class="step"><img src="${img(seed, 640, 360)}" alt="" loading="lazy">
  <div><span class="num">0${i + 1}</span><h3>${t}</h3><p>${p}</p></div></article>`).join("");

$("planGrid").innerHTML = [
  ["Pay as you go", "₹0", "/month", ["No subscription", "Standard station prices", "Instant demo booking"], "Start free", ""],
  ["Plus", "₹299", "/month", ["10% off every kWh", "Priority slot booking", "Free cancellation", "Email receipts"], "Choose Plus", "hot"],
  ["Fleet", "₹999", "/month", ["20% off every kWh", "Up to 10 vehicles", "Monthly usage report", "Dedicated support"], "Contact sales", ""]
].map(([n, a, per, f, b, hot]) => `<article class="plan ${hot}">${hot ? '<span class="tag">MOST POPULAR</span>' : ""}
  <h3>${n}</h3><div class="amt">${a}<small>${per}</small></div>
  <ul>${f.map(x => `<li>${x}</li>`).join("")}</ul>
  <a class="btn ${hot ? "" : "ghost"}" href="#bookingSection">${b}</a></article>`).join("");

$("reviewGrid").innerHTML = [
  ["Aarav S.", "Velachery", "Found a free CCS2 charger in seconds and the map link got me there. Booking was painless.", "avatar-aarav"],
  ["Meera K.", "Anna Nagar", "I love checking availability before leaving home. No more waiting around at stations.", "avatar-meera"],
  ["Rohit P.", "Tambaram", "Clear pricing and the calculator helps me plan my weekend trips. Highly recommended.", "avatar-rohit"]
].map(([n, a, t, s]) => `<article class="review"><div class="stars">★★★★★</div><p>“${t}”</p>
  <div class="who"><img src="${img(s, 96, 96)}" alt="" loading="lazy"><div><b>${n}</b><small>${a}, Chennai</small></div></div></article>`).join("");

$("faqList").innerHTML = [
  ["How do I find a charger?", "Search by name or area, filter by availability or connector, or open the map to see stations around Chennai."],
  ["Can I cancel a booking?", "Yes. Open My Bookings and press Cancel Booking at any time."],
  ["Which connectors are supported?", "Stations offer CCS2 for fast DC charging and Type 2 for AC charging."],
  ["Is the payment real?", "No. This is a college prototype, so payments are demo only and no money is charged."],
  ["How do I get directions?", "Press the Map button on any station, or use Get directions in the map section to open Google Maps."]
].map(([a, b]) => `<details><summary>${a}</summary><p>${b}</p></details>`).join("");

$("gallery").innerHTML = ["ev-g1", "ev-g2", "ev-g3", "ev-g4", "ev-g5", "ev-g6"]
  .map(s => `<img src="${img(s, 300, 300)}" alt="" loading="lazy">`).join("");

/* ---------- Stations ---------- */
const grid = $("stationGrid"), searchInput = $("searchInput"), statusFilter = $("statusFilter");
let connector = "all";
const bookingStation = $("bookingStation"), calcStation = $("calcStation");
stations.forEach(s => {
  bookingStation.add(new Option(`${s.name} - ${s.address}`, s.id));
  calcStation.add(new Option(`${s.name} (${s.power} kW)`, s.id));
});
$("liveCount").textContent = `${stations.filter(s => s.status === "available").length} available`;

function renderStations() {
  const search = searchInput.value.trim().toLowerCase();
  const list = stations.filter(s =>
    [s.name, s.city, s.address, s.connector].some(v => v.toLowerCase().includes(search)) &&
    (statusFilter.value === "all" || s.status === statusFilter.value) &&
    (connector === "all" || s.connector === connector));

  $("resultCount").textContent = `${list.length} station(s) found`;
  if (!list.length) { grid.innerHTML = "<p>No stations found. Try another search.</p>"; return; }

  grid.innerHTML = list.map(s => {
    const ok = s.status === "available";
    return `<article class="station-card">
      <div class="station-img"><img src="${img("station" + s.id, 640, 400)}" alt="${esc(s.name)}" loading="lazy">
        <span class="status ${s.status}">${ok ? "Available" : "Occupied"}</span><span class="kw">${s.power} kW</span></div>
      <div class="station-body">
        <h3>${s.name}</h3><p>📍 ${s.address}, Chennai</p>
        <div class="card-details"><span>${s.connector}</span><span>${s.power} kW</span><span>24/7</span></div>
        <p class="price">₹${s.price} <small>per kWh</small></p>
        <div class="card-actions">
          <button class="btn" data-station-id="${s.id}" ${ok ? "" : "disabled"}>${ok ? "Book a charger" : "Currently occupied"}</button>
          <a class="btn ghost" href="${mapLink(s)}" target="_blank" rel="noopener" aria-label="Open ${esc(s.name)} in Google Maps">📍 Map</a>
        </div></div></article>`;
  }).join("");
  reveal(grid.querySelectorAll(".station-card"));
}

$("searchBtn").addEventListener("click", renderStations);
searchInput.addEventListener("input", renderStations);
statusFilter.addEventListener("change", renderStations);
$("chips").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  connector = chip.dataset.c;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === chip));
  renderStations();
});

$("quick").addEventListener("submit", e => {
  e.preventDefault();
  searchInput.value = $("quickSearch").value;
  connector = $("quickConnector").value || "all";
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.c === connector));
  renderStations();
  $("stations").scrollIntoView({ behavior: "smooth" });
});

grid.addEventListener("click", e => {
  const b = e.target.closest("button[data-station-id]");
  if (!b || b.disabled) return;
  const s = stations.find(x => x.id === Number(b.dataset.stationId));
  bookingStation.value = s.id;
  toast(`${s.name} selected · ${s.connector} · ${s.power} kW · ₹${s.price}/kWh`);
  $("bookingSection").scrollIntoView({ behavior: "smooth" });
});

/* ---------- Google Maps ---------- */
const mapList = $("mapList");
mapList.innerHTML = stations.map(s =>
  `<li><button data-id="${s.id}"><b>${s.name}</b><small>${s.address} · ${s.connector}</small></button></li>`).join("");

function showOnMap(s) {
  $("mapFrame").src = embed(`${s.name} ${s.address} Chennai`);
  $("mapOpen").href = mapLink(s);
  $("mapDir").href = dirLink(s);
  mapList.querySelectorAll("button").forEach(b => b.classList.toggle("on", Number(b.dataset.id) === s.id));
}
mapList.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) showOnMap(stations.find(s => s.id === Number(b.dataset.id)));
});
$("mapFrame").src = embed("EV charging stations Chennai");
$("mapOpen").href = "https://www.google.com/maps/search/?api=1&query=EV+charging+stations+Chennai";
$("mapDir").href = "https://www.google.com/maps/dir/?api=1&destination=EV+charging+stations+Chennai";

/* ---------- Calculator ---------- */
function calc() {
  const s = stations.find(x => x.id === Number(calcStation.value)) || stations[0];
  const kwh = Number($("calcKwh").value);
  const mins = Math.round(kwh / (s.power * 0.9) * 60);
  $("calcKwhLabel").textContent = kwh + " kWh";
  $("calcCost").textContent = "₹" + kwh * s.price;
  $("calcTime").textContent = mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : mins + " min";
  $("calcPower").textContent = `${s.power} kW ${s.connector}`;
  $("calcPrice").textContent = `₹${s.price} per kWh`;
}
calcStation.addEventListener("change", calc);
$("calcKwh").addEventListener("input", calc);
calc();

/* ---------- Booking ---------- */
const bookingDate = $("bookingDate"), bookingMessage = $("bookingMessage");
const paymentSection = $("paymentSection"), paymentMessage = $("paymentMessage"), payButton = $("payButton");
const now = new Date();
bookingDate.min = new Date(now - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];

const show = (el, text, ok) => { el.textContent = text; el.className = ok ? "msg-ok" : ""; };

$("bookingForm").addEventListener("submit", e => {
  e.preventDefault();
  const s = stations.find(x => x.id === Number(bookingStation.value));
  const date = bookingDate.value, time = $("bookingTime").value;

  if (!s || !date || !time) return show(bookingMessage, "Please select a station, date, and time.");
  if (s.status !== "available") return show(bookingMessage, "This sample charger is occupied. Please choose an available station.");
  if (new Date(`${date}T${time}:00`) <= new Date()) return show(bookingMessage, "Please select a future date and time.");

  const id = "CE" + Date.now().toString().slice(-6);
  const bookings = loadBookings();
  bookings.push({
    id, customerName: $("customerName").value.trim(), customerEmail: $("customerEmail").value.trim(),
    station: s.name, date, time, vehicle: $("vehicleNumber").value.trim(), paymentStatus: "Pending demo payment"
  });
  saveBookings(bookings);
  localStorage.setItem("currentChargeEaseBookingId", id);
  renderMyBookings();

  show(bookingMessage, "Booking request created! Booking ID: " + id, true);
  $("paymentBookingId").textContent = id;
  $("paymentStation").textContent = s.name;
  $("paymentAmount").textContent = `₹${10 * s.price} (demo estimate for 10 kWh)`;
  paymentMessage.textContent = "";
  payButton.disabled = false;
  payButton.textContent = "Pay Now (Demo)";
  paymentSection.hidden = false;
  paymentSection.scrollIntoView({ behavior: "smooth" });
  toast("Booking created · " + id);
});

payButton.addEventListener("click", () => {
  const bookings = loadBookings();
  const b = bookings.find(x => x.id === localStorage.getItem("currentChargeEaseBookingId"));
  if (b) { b.paymentStatus = "Demo payment completed"; saveBookings(bookings); renderMyBookings(); }
  show(paymentMessage, `Demo payment successful! Method: ${$("paymentMethod").value}. No real money was charged.`, true);
  payButton.disabled = true;
  payButton.textContent = "Demo Payment Completed";
  toast("Demo payment completed ✓");
});

function renderMyBookings() {
  const list = $("myBookingsList"), bookings = loadBookings();
  if (!bookings.length) { list.innerHTML = "<p>No bookings yet. Book a charging slot to get started!</p>"; return; }
  list.innerHTML = bookings.slice().reverse().map(b => {
    const status = b.bookingStatus || "Confirmed";
    return `<article class="booking-card"><h3>Booking ${esc(b.id)}</h3>
      <p>Customer: ${esc(b.customerName)} (${esc(b.customerEmail)})</p>
      <p>Station: ${esc(b.station)}</p>
      <p>Date: ${esc(b.date)} | Time: ${esc(b.time)}</p>
      <p>Booking Status: ${status}</p><p>Payment: ${esc(b.paymentStatus)}</p>
      ${b.vehicle ? `<p>Vehicle: ${esc(b.vehicle)}</p>` : ""}
      ${status !== "Cancelled" ? `<button type="button" class="btn danger sm" data-cancel-booking-id="${esc(b.id)}">Cancel Booking</button>` : ""}
    </article>`;
  }).join("");
}

$("myBookingsList").addEventListener("click", e => {
  const b = e.target.closest("button[data-cancel-booking-id]");
  if (!b) return;
  const id = b.dataset.cancelBookingId;
  if (!confirm("Are you sure you want to cancel booking " + id + "?")) return;
  const bookings = loadBookings(), item = bookings.find(x => x.id === id);
  if (!item || item.bookingStatus === "Cancelled") return;
  item.bookingStatus = "Cancelled";
  saveBookings(bookings);
  renderMyBookings();
  toast("Booking cancelled");
});

$("newsForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast("Thanks for subscribing (demo)"); });

/* ---------- Nav, scroll helpers, counters ---------- */
const nav = $("nav"), burger = $("burger"), toTop = $("toTop");
const setMenu = open => { nav.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); };
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$("menu").addEventListener("click", e => e.target.closest("a") && setMenu(false));
$("toTop").addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", scrollY > 20);
  toTop.classList.toggle("show", scrollY > 700);
}, { passive: true });

if ("IntersectionObserver" in window) {
  const links = [...document.querySelectorAll("#menu a")];
  const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting &&
    links.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id))), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(a => { const t = document.querySelector(a.hash); t && spy.observe(t); });
}

document.querySelectorAll("[data-count]").forEach(el => {
  const end = Number(el.dataset.count), suffix = el.dataset.suffix || "", t0 = performance.now();
  const tick = t => {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  reduce ? (el.textContent = end + suffix) : requestAnimationFrame(tick);
});

reveal(document.querySelectorAll(".head, .search-bar, .map-wrap, .calc, .book, .panel, .cta-in, .step, .plan, .review, .faq details"));
renderStations();
renderMyBookings();