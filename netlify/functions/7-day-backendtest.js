var client;

if (window.XMLHttpRequest) {
  client = new XMLHttpRequest();
} else {
  client = new ActiveXObject("Microsoft.XMLHTTP");
}

client.open('GET', 'https://www-service.fanzo.com/venues/127232/fixture/xml?newFields=1');

client.onreadystatechange = function () {
  if (client.readyState == 4 && client.status == 200) {
    var xmlfanzo = client.responseXML;
    var items = xmlfanzo.getElementsByTagName("item");
    var currentDate = new Date();
    var nextSevenDays = new Date(currentDate);
    nextSevenDays.setDate(currentDate.getDate() + 7);
    var container = document.getElementById("container");

    // Separate the first game
    if (items.length > 0) {
      var firstItem = items[0];
      var startTimeStr = firstItem.getElementsByTagName("start_time")[0].textContent;
      var startTime = new Date(startTimeStr);
      if (startTime >= currentDate && startTime <= nextSevenDays) {
        var day = startTime.toLocaleDateString(undefined, { weekday: 'short' });
        var time = startTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        var event = firstItem.getElementsByTagName("event")[0].textContent;
        var league = firstItem.getElementsByTagName("league")[0].textContent;
        var sound = firstItem.getElementsByTagName("sound")[0].textContent;

        var nextUpHTML = "<h2>Next Up</h2>";
        nextUpHTML += "<table class='my-table'>";
        nextUpHTML += "<tr><th>Day</th><th>Event</th><th>League</th><th>Time</th><th>Sound</th></tr>";
        nextUpHTML += "<tr><td>" + day + "</td><td>" + event + "</td><td>" + league + "</td><td>" + time + "</td><td>" + sound + "</td></tr>";
        nextUpHTML += "</table>";

        container.innerHTML += nextUpHTML;
      }
    }

    // Remaining games
    var tableString = "<h2>Upcoming Games</h2>";
    tableString += "<table class='my-table'>";
    tableString += "<tr><th>Day</th><th>Event</th><th>League</th><th>Time</th><th>Sound</th></tr>";

    for (var i = 1; i < items.length; i++) {
      var startTimeStr = items[i].getElementsByTagName("start_time")[0].textContent;
      var startTime = new Date(startTimeStr);
      if (startTime >= currentDate && startTime <= nextSevenDays) {
        var day = startTime.toLocaleDateString(undefined, { weekday: 'short' });
        var time = startTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        var event = items[i].getElementsByTagName("event")[0].textContent;
        var league = items[i].getElementsByTagName("league")[0].textContent;
        var sound = items[i].getElementsByTagName("sound")[0].textContent;

        tableString += "<tr><td>" + day + "</td><td>" + event + "</td><td>" + league + "</td><td>" + time + "</td><td>" + sound + "</td></tr>";
      }
    }

    tableString += "</table>";
    container.innerHTML += tableString;
  }
};

client.send();
