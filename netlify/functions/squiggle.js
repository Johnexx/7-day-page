export async function handler(event, context) {
  const url = "https://api.squiggle.com.au/?q=games;year=2025;round=15;format=xml";

  try {
    const response = await fetch(url);
    const xml = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Origin": "*"
      },
      body: xml
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Failed to fetch Squiggle XML: " + error.message
    };
  }
}
