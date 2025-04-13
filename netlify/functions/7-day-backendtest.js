window.onload = function () {
  const container = document.getElementById("container");

  fetch('https://www-service.fanzo.com/venues/127232/fixture/xml?newFields=1')
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.text();
    })
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.getElementsByTagName("item");
      if (items.length === 0) {
        container.innerHTML = "<p>No games found.</p>";
        return;
      }

      const now = new Date();
      const weekAhead = new Date();
      weekAhead.setDate(now.getDate() + 7);

      // Build Next Up (First valid game)
      let firstGameHTML = '';
      let remainingGamesHTML = '';
      let foundFirst = false;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const startTime = new Date(item.getElementsByTagName("start_time")[0].textContent);
        if (startTime < now || startTime > weekAhead) continue;

        const day = startTime.toLocaleDateString(undefined, { weekday: 'short' });
        const time = startTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        const event = item.getElementsByTagName("event")[0].textContent;
        const league = item.getElementsByTagName("league")[0].textContent;
        const sound = item.getElementsByTagName("sound")[0].textContent;

        const row = `<tr><td>${day}</td><td>${event}</td><td>${league}</td><td>${time}</td><td>${sound}</td></tr>`;

        if (!foundFirst) {
          firstGameHTML += `
            <h2>Next Up</h2>
            <table class="my-table">
              <tr><th>Day</th><th>Event</th><th>League</th><th>Time</th><th>Sound</th></tr>
              ${row}
            </table>`;
          foundFirst = true;
        } else {
          remainingGamesHTML += row;
        }
      }

      // Add remaining games
      if (remainingGamesHTML) {
        remainingGamesHTML = `
          <h2>Upcoming Games</h2>
          <table class="my-table">
            <tr><th>Day</th><th>Event</th><th>League</th><th>Time</th><th>Sound</th></tr>
            ${remainingGamesHTML}
          </table>`;
      }

      container.innerHTML = firstGameHTML + remainingGamesHTML;
    })
    .catch(err => {
      console.error("Error fetching or parsing data:", err);
      container.innerHTML = "<p>Error loading sports fixtures. Check console.</p>";
    });
};
