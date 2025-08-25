export async function handler(event, context) {
  try {
    // Define all round date ranges
    const rounds = [
      { name: "Opening Round", start: "2025-03-06", end: "2025-03-09" },
      { name: "Round 1", start: "2025-03-10", end: "2025-03-16" },
      { name: "Round 2", start: "2025-03-17", end: "2025-03-23" },
      { name: "Round 3", start: "2025-03-24", end: "2025-03-30" },
      { name: "Round 4", start: "2025-03-31", end: "2025-04-06" },
      { name: "Round 5", start: "2025-04-07", end: "2025-04-13" },
      { name: "Round 6", start: "2025-04-14", end: "2025-04-20" },
      { name: "Round 7", start: "2025-04-21", end: "2025-04-27" },
      { name: "Round 8", start: "2025-04-28", end: "2025-05-04" },
      { name: "Round 9", start: "2025-05-05", end: "2025-05-11" },
      { name: "Round 10", start: "2025-05-12", end: "2025-05-18" },
      { name: "Round 11", start: "2025-05-19", end: "2025-05-25" },
      { name: "Round 12", start: "2025-05-26", end: "2025-06-01" },
      { name: "Round 13", start: "2025-06-02", end: "2025-06-08" },
      { name: "Round 14", start: "2025-06-09", end: "2025-06-15" },
      { name: "Round 15", start: "2025-06-16", end: "2025-06-22" },
      { name: "Round 16", start: "2025-06-23", end: "2025-06-29" },
      { name: "Round 17", start: "2025-06-30", end: "2025-07-06" },
      { name: "Round 18", start: "2025-07-07", end: "2025-07-13" },
      { name: "Round 19", start: "2025-07-14", end: "2025-07-20" },
      { name: "Round 20", start: "2025-07-21", end: "2025-07-27" },
      { name: "Round 21", start: "2025-07-28", end: "2025-08-03" },
      { name: "Round 22", start: "2025-08-04", end: "2025-08-10" },
      { name: "Round 23", start: "2025-08-11", end: "2025-08-17" },
      { name: "Round 24", start: "2025-08-18", end: "2025-08-24" },
      { name: "Bye Round", start: "2025-08-25", end: "2025-08-31" }
    ];

    const today = new Date();

    // Find current round
const currentRound = rounds.find((round) => {
  const start = new Date(round.start + "T00:00:00");
  const end = new Date(round.end + "T23:59:59");
  return today >= start && today <= end;
});

    let roundParam = null;

    // Extract the round number (skip if Opening/Bye)
    if (currentRound && /^Round (\d+)$/.test(currentRound.name)) {
      roundParam = parseInt(currentRound.name.match(/^Round (\d+)$/)[1], 10);
    }

    // If no round matched or it's "Opening Round"/"Bye Round", fallback to a default round
    if (!roundParam) {
      roundParam = 1; // Fallback round, or you could return an error
    }

    //const url = `https://api.squiggle.com.au/?q=games;year=2025;round=${roundParam};format=xml`;
     const url = `https://api.squiggle.com.au/?q=games;year=2025;round=${roundParam};format=xml`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "AFL Display - Johnrk95@gmail.com"
      }
    });

    const xml = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*"
      },
      body: xml
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Fetch failed: ${err.message}`
    };
  }
}
