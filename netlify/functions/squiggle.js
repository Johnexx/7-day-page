fetch('/.netlify/functions/squiggle')
  .then(response => response.text())
  .then(xmlString => {
    console.log("RAW XML:", xmlString); // 👈 ADD THIS

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    const gameNodes = xmlDoc.getElementsByTagName("game");
    console.log("Found games:", gameNodes.length); // 👈 ADD THIS

    const container = document.getElementById("games");
    container.innerHTML = "";

    for (let game of gameNodes) {
      const ateam = game.getElementsByTagName("ateam")[0]?.textContent;
      const hteam = game.getElementsByTagName("hteam")[0]?.textContent;
      const ascore = parseInt(game.getElementsByTagName("ascore")[0]?.textContent || "0");
      const hscore = parseInt(game.getElementsByTagName("hscore")[0]?.textContent || "0");
      const localtime = game.getElementsByTagName("localtime")[0]?.textContent;

      const displayText = (ascore > 0 || hscore > 0)
        ? `${hteam} ${hscore} Vs ${ateam} ${ascore} ${localtime}`
        : `${hteam} Vs ${ateam} ${localtime}`;

      const div = document.createElement("div");
      div.className = "game";
      div.textContent = displayText;
      container.appendChild(div);
    }
  })
  .catch(err => {
    document.getElementById("games").textContent = "Failed to load games.";
    console.error("Error:", err);
  });
