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
    var upcomingTable = "<h2></h2><table class='my-table'>";
    upcomingTable += "<tr><th></th><th></th><th></th><th></th><th></th></tr>";

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
          leagueIcon = "<img src='images/Afl_logo.png' alt='AFL Icon' width='60'>";
        } else if (description.toLowerCase().includes("nrl")) {
          leagueIcon = "<img src='images/NRL_logo.png' alt='NRL Icon' width='50'>";
        }

        if (gameCount === 0) {
          // "Next Up" game
          var team1Img = items[i].getElementsByTagName("team1")[0]?.textContent.trim() || "";
          var team2Img = items[i].getElementsByTagName("team2")[0]?.textContent.trim() || "";

          var team1Name = "", team2Name = "";
          if (title.includes(" vs ")) {
            [team1Name, team2Name] = title.split(" vs ");
          } else if (title.includes(" v ")) {
            [team1Name, team2Name] = title.split(" v ");
          } else {
            team1Name = title;
          }

          nextUpTable = "<h2></h2><table class='my-table next-up-table'>";

          // Logos row with "vs"
          nextUpTable += "<tr><td style='text-align:right; width:40%'>";
          if (team1Img) nextUpTable += "<img src='" + team1Img + "' alt='Team 1' style='max-height:150px; margin: auto'>";
          nextUpTable += "</td><td style='text-align:center; width:20%'><span style='font-size:32px;'>vs</span></td><td style='text-align:left; width:40%'>";
          if (team2Img) nextUpTable += "<img src='" + team2Img + "' alt='Team 2' style='max-height:150px; margin: auto'>";
          nextUpTable += "</td></tr>";

          // Team names row
          nextUpTable += "<tr><td style='text-align:right; font-weight:bold; font-size:40px;'>" + team1Name + "</td>";
          nextUpTable += "<td></td>";
          nextUpTable += "<td style='text-align:left; font-weight:bold; font-size:40px;'>" + team2Name + "</td></tr>";

          // Centered time/sound under "vs"
          nextUpTable += "<tr><td></td><td style='text-align:center; line-height:1.6; font-size:16px;'>";
          nextUpTable += dayOfWeek + "<br>" + formattedTime + "<br>" + soundDisplay;
          nextUpTable += "</td><td></td></tr>";

          nextUpTable += "</table>";
        } else {
          // Other games → Upcoming list
          var rowHTML = "<tr>";
          rowHTML += "<td>" + leagueIcon + "</td>";
          rowHTML += "<td>" + title + "</td>";
          rowHTML += "<td>" + dayOfWeek + "</td>";
          rowHTML += "<td>" + formattedTime + "</td>";
          rowHTML += "<td>" + soundDisplay + "</td>";
          rowHTML += "</tr>";

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

// ✅ Abbreviated Day Names
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
