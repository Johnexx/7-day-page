<script>
  fetch('/.netlify/functions/squiggle')
    .then(res => res.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, "application/xml");

      const games = xml.getElementsByTagName("anon");
      const output = document.getElementById("games");
      output.innerHTML = "";

      for (let game of games) {
        const hteam = game.getElementsByTagName("hteam")[0]?.textContent || "";
        const hscore = parseInt(game.getElementsByTagName("hscore")[0]?.textContent || "0");
        const ateam = game.getElementsByTagName("ateam")[0]?.textContent || "";
        const ascore = parseInt(game.getElementsByTagName("ascore")[0]?.textContent || "0");
        const localtime = game.getElementsByTagName("localtime")[0]?.textContent || "";

        const hasScore = ascore > 0 || hscore > 0;
        const displayText = hasScore
          ? `${hteam} ${hscore} Vs ${ateam} ${ascore} ${localtime}`
          : `${hteam} Vs ${ateam} ${localtime}`;

        const div = document.createElement("div");
        div.className = "game";
        div.textContent = displayText;
        output.appendChild(div);
      }
    })
    .catch(err => {
      console.error("Failed to load or parse XML:", err);
      document.getElementById("games").textContent = "Failed to load games.";
    });
</script>
