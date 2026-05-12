export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key, x-claude-key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { endpoint, service } = req.query;

  if (service === "claude") {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY || req.headers["x-claude-key"],
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  const apiKey = req.headers["x-api-key"];
  if (!apiKey) return res.status(401).json({ error: "API ключ не передано" });
  if (!endpoint) return res.status(400).json({ error: "endpoint не вказано" });

  try {
    const response = await fetch(`https://openapi.keycrm.app/v1/${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
