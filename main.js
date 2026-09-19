// Open/closed status, based on deli time (Tucson doesn't do daylight saving).
(function () {
  var OPEN = 9.5, CLOSE = 16; // 9:30 AM – 4 PM, Monday–Saturday

  var parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23"
  }).formatToParts(new Date());
  var get = function (t) { return parts.find(function (p) { return p.type === t; }).value; };
  var day = get("weekday");
  var hour = Number(get("hour")) + Number(get("minute")) / 60;
  var isOpenDay = day !== "Sun";
  var open = isOpenDay && hour >= OPEN && hour < CLOSE;

  var text;
  if (open) text = "Open now · until 4 PM";
  else if (isOpenDay && hour < OPEN) text = "Closed · opens at 9:30 AM";
  else if (day === "Sat" || day === "Sun") text = "Closed · opens Monday 9:30 AM";
  else text = "Closed · opens tomorrow 9:30 AM";

  document.querySelectorAll("[data-status]").forEach(function (el) {
    el.textContent = text;
    el.classList.add(open ? "is-open" : "is-closed");
  });

  var today = document.querySelector('[data-day="' + day + '"]');
  if (today) today.classList.add("today");
})();

// Highlight the menu category currently on screen.
(function () {
  var links = document.querySelectorAll(".chips a");
  if (!links.length || !("IntersectionObserver" in window)) return;

  var byId = {};
  links.forEach(function (a) { byId[a.hash.slice(1)] = a; });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove("active"); });
      var link = byId[entry.target.id];
      link.classList.add("active");
      var row = link.closest("ul");
      row.scrollTo({ left: link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2 });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  Object.keys(byId).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();
