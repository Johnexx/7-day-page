export async function handler(event, context) {
  try {
    const response = await fetch(
      "https://api.squiggle.com.au/?q=games;year=2025;round=15;format=xml",
      {
        headers: {
          "User-Agent": "33 Degrees AFL Board - contact@33degrees.com.au"
        }
      }
    );

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
      body: `Error fetching data: ${err.message}`
    };
  }
}
