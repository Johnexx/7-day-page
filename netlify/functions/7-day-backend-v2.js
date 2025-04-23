var client;
if (window.XMLHttpRequest) {
  client = new XMLHttpRequest();
} else {
  client = new ActiveXObject("Microsoft.XMLHTTP");
}
client.open('GET', 'https://www-service.fanzo.com/venues/127232/fixture/xml?newFields=1');

client.onreadystatechange = function() {
  if (client.readyState == 4 && client.status == 200) {
    var xmlfanzo = client.responseXML;
    var items = xmlfanzo.getElementsByTagName("item");
    
    var currentDate = new Date(); // Today
    var startOfNextWeek = new Date(currentDate);
    startOfNextWeek.setDate(currentDate.getDate() + 7); // 7 days from now

    var endOfNextWeek = new Date(currentDate);
    endOfNextWeek.setDate(currentDate.getDate() + 14); // 14 days from now

    var thisWeekTable = "<h2>This Week</h2><table class='my-table'><tr><th>Title</th><th>Description</th><th>Day</th><th>Time</th><th></th></tr>";
    var nextWeekTable = "<h2>Next Week</h2><table class='my-table'><tr><th>Title</th><th>Description</th><th>Day</th><th>Time</th><th></th></tr>";

    for (var i = 0; i < items.length; i++) {
      var startTimeStr = items[i].getElementsByTagName("startTimeLocal")[0].childNodes[0].nodeValue;
      var startTime = new Date(startTimeStr);

      var dayOfWeek = formatDay(startTime);
      var formattedTime = formatTime(startTime);
      var description = items[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
      var title = items[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
      var soundValue = items[i].getElementsByTagName("sound")[0]?.textContent.trim() || "0";
      var soundDisplay = soundValue === "1" ? "<img src='volume.png' alt='Sound' width='16'>" : "";

      var row = "<tr><td>" + title + "</td><td>" + description + "</td><td>" + dayOfWeek + "</td><td>" + formattedTime + "</td><td>" + soundDisplay + "</td></tr>";

      if (startTime >= currentDate && startTime < startOfNextWeek) {
        thisWeekTable += row;
      } else if (startTime >= startOfNextWeek && startTime < endOfNextWeek) {
        nextWeekTable += row;
      }
    }

    thisWeekTable += "</table>";
    nextWeekTable += "</table>";

    var container = document.getElementById("container");
    container.innerHTML = thisWeekTable + nextWeekTable;
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
