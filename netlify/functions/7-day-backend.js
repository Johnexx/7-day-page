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
    var currentDate = new Date(); // Get the current date and time
    var nextSixDays = new Date(currentDate);
    nextSixDays.setDate(currentDate.getDate() + 7); // Calculate date 7 days from now

    var container = document.getElementById("container");
    var tableString = "<table class='my-table'>"; // Added class for styling

    // Add table headers
    tableString += "<tr><th>Day</th><th>Event</th><th>Description</th><th>Sound</th><th>Time</th></tr>";

    for (var i = 0; i < items.length; i++) {
      var startTimeStr = items[i].getElementsByTagName("startTimeLocal")[0].childNodes[0].nodeValue;
      var startTime = new Date(startTimeStr);

      // Check if the event's start time is within the next 7 days
      if (startTime >= currentDate && startTime <= nextSixDays) {
        var dayOfWeek = formatDay(startTime); // Get the day of the week
        var formattedTime = formatTime(startTime); // Get the time
        var description = items[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        var title = items[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        var sound = items[i].getElementsByTagName("sound")[0]?.textContent || "0"; // Default to "0" if missing

        tableString += "<tr>";
        tableString += "<td>" + dayOfWeek + "</td>"; // Day
        tableString += "<td>" + title + "</td>";     // Event title
        tableString += "<td>" + description + "</td>"; // Description
        tableString += "<td>" + sound + "</td>";     // Sound value (1 or 0)
        tableString += "<td>" + formattedTime + "</td>"; // Time
        tableString += "</tr>";
      }
    }

    tableString += "</table>";
    container.innerHTML = tableString;
  }
};

client.send();

// Function to get the day of the week
function formatDay(date) {
  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek[date.getDay()];
}

// Function to format time as "HH:MM AM/PM"
function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}
