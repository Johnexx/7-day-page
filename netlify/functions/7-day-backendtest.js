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
    var nextSixDays = new Date(currentDate);
    nextSixDays.setDate(currentDate.getDate() + 7);

    var container = document.getElementById("container");
    var nextUpTable = "";
    var upcomingTable = "<h2>Upcoming Games</h2><table class='my-table'>";
    upcomingTable += "<tr><th>Day</th><th>Event</th><th>League</th><th>Time</th><th>Sound</th></tr>";

    var gameCount = 0;

    for (var i = 0; i < items.length; i++) {
      var startTimeNode = items[i].getElementsByTagName("startTimeLocal")[0];
      if (!startTimeNode || !startTimeNode.childNodes[0]) continue;
      var startTimeStr = startTimeNode.childNodes[0].nodeValue;
      var startTime = new Date(startTimeStr);

      if (startTime >= currentDate && startTime <= nextSixDays) {
        var dayOfWeek = formatDay(startTime);
        var formattedTime = formatTime(startTime);
        var description = items[i].getElementsByTagName("description")[0]?.childNodes[0]?.nodeValue || "";
        var title = items[i].getElementsByTagName("title")[0]?.childNodes[0]?.nodeValue || "";

        var soundValue = items[i].getElementsByTagName("sound")[0]?.textContent.trim() || "0";
        var soundDisplay = soundValue === "1" ? "<img src='volume.png' alt='Sound' width='16'>" : "";

        var leagueIcon = "";
        if (description.toLowerCase().includes("afl")) {
          leagueIcon = "<img src='images/afl_icon.png' alt='AFL Icon' width='20'>";
        } else if (description.toLowerCase().includes("nrl")) {
          leagueIcon = "<img src='images/nrl_icon.png' alt='NRL Icon' width='20'>";
        }

        var rowHTML = "<tr>";
        rowHTML += "<td>" + dayOfWeek + "</td>";
        rowHTML += "<td>" + title + "</td>";
        rowHTML += "<td>" + leagueIcon + "</td>";
        rowHTML += "<td>" + formattedTime + "</td>";
        rowHTML += "<td>" + soundDisplay + "</td>";
        rowHTML += "</tr>";

        if (gameCount === 0) {
          // Get team logos for first game
          var team1 = items[i].getElementsByTagName("team1")[0]?.textContent.trim() || "";
          var team2 = items[i].getElementsByTagName("team2")[0]?.textContent.trim() || "";
          var teamRow = "";

          if (team1 || team2) {
            teamRow += "<tr><td colspan='5' style='text-align:center;'>";
            if (team1) teamRow += "<img src='" + team1 + "' alt='Team 1' style='max-height:40px; margin: 0 10px;'>";
            if (team2) teamRow += "<img src='" + team2 + "' alt='Team 2' style='max-height:40px; margin: 0 10px;'>";
            teamRow += "</td></tr>";
          }

          nextUpTable = "<h2>Next Up</h2><table class='my-table'>";
          nextUpTable += "<tr><th>Day</th><th>Event</th><th>League</th><th>Time</th><th>Sound</th></tr>";
          nextUpTable += teamRow;
          nextUpTable += rowHTML;
          nextUpTable += "</table>";
        } else {
          upcomingTable += rowHTML;
        }

        gameCount++;
      }
    }

    upcomingTable += "</table>";

    if (gameCount === 0) {
      container.innerHTML = "<p>No upcoming games found.</p>";
    } else {
      container.innerHTML = nextUpTable + upcomingTable;
    }
  }
};

client.send();

function formatDay(date) {
  var daysAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysAbbr[date.getDay()];
}

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}
