const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { topic, stakeholder, issue, keywords } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          {
            role: "user",
            content: `
You are an expert QLD Design teacher.

INPUT:
Topic: ${topic}
Stakeholder: ${stakeholder}
Issue: ${issue}
Keywords: ${keywords}

RULES:
- Design Problem = EXACTLY 2 paragraphs
- Design Criteria = EXACTLY 3 dot points
- Each stakeholder section = 3 dot points
- Keep concise and realistic

Return JSON only:

{
  "design_problem": "...",
  "design_criteria": ["...", "...", "..."],
  "about": "...",
  "experiences": ["...", "...", "..."],
  "attitudes": ["...", "...", "..."],
  "motivations": ["...", "...", "..."],
  "expectations": ["...", "...", "..."]
}
`
          }
        ]
      })
    });

    const data = await response.json();

    const output = JSON.parse(data.choices[0].message.content);

    res.json(output);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate" });
  }
});

app.get("/", (req, res) => {
  res.send("Server running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
