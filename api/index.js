require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(process.env.GEMINI_API_KEY)

const generatePrompt = (data) => {
  const { productName, description, techStack, audience, platform } = data;

  return `
    Act as a senior marketing expert for developers.
    Product: ${productName}
    Description: ${description}
    Tech Stack: ${techStack || 'Not specified'}
    Target Audience: ${audience}
    Platform: ${platform}

    Task: Write a post/copy for this product specifically for ${platform}.
    
    IMPORTANT: Return the response as a strictly valid JSON array of objects.
    Format: [{"title": "Section Name", "content": "The content here"}]
    
    Do not add markdown formatting like \`\`\`json. Just the raw JSON string.
    
    Structure the content based on the platform:
    - If X: Hook, Value Proposition, Tech Highlight, Call to Action.
    - If LinkedIn: Intro, Problem, Solution, Why it matters, Call to Action.
    - If Landing Page: Headline, Subheading, Key Features, Call to Action.
  `;
};

app.post('/api/generate', async (req, res) => {
  try {
    const { productName, description, platform } = req.body;
    if (!productName || !description || !platform) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Updated model
    const prompt = generatePrompt(req.body);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Cleanup: Remove markdown code blocks if Gemini adds them
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse JSON manually to ensure validity before sending
    const structuredContent = JSON.parse(text);

    res.json({ success: true, content: structuredContent });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate content. Try again." });
  }
});

const PORT = process.env.PORT || 5000;

// Only listen when running locally, Vercel handles this automatically in production
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;