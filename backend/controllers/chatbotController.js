const { GoogleGenerativeAI } = require('@google/generative-ai');
const Movie = require('../models/Movie');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: retry with delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendWithRetry(chat, message, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (err) {
      if (err.status === 429 && i < retries) {
        // Extract retry delay from error or use default 10s
        const waitTime = (i + 1) * 10000; // 10s, 20s
        console.log(`Rate limited. Retrying in ${waitTime / 1000}s... (attempt ${i + 2}/${retries + 1})`);
        await delay(waitTime);
      } else {
        throw err;
      }
    }
  }
}

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Fetch movies for context
    const movies = await Movie.find().populate('category').select('title language category summary').limit(50);
    const movieList = movies.map(m =>
      `- ${m.title} (${m.language}, ${m.category?.name || 'General'}): ${m.summary ? m.summary.substring(0, 50) : ''}...`
    ).join('\n');

    const systemInstruction = `You are the EXCLUSIVE Movie Hub Assistant. You have STRICT boundaries.

KNOWLEDGE BASE (ONLY use this information):
1. MOVIES AVAILABLE:
${movieList}

2. PLATFORM INFO:
- Subscriptions: Basic ($4.99), Standard ($9.99), Premium ($14.99).
- Features: 4K streaming, Multiple screens, Cancel anytime.
- Payment: Secure via Stripe (accepts Test Cards for demo).

STRICT RULES:
- ONLY discuss movies listed above. If a user asks about a movie NOT in the list (e.g. "Spiderman" if not listed), you MUST say: "I'm sorry, that movie is not currently available on Movie Hub. Please try searching for our available titles like [mention 2 similar movies from the list]."
- DO NOT answer general questions outside of cinema, movies, or this platform.
- If asked "Who are you?", say: "I am the Movie Hub AI Assistant, here to help you navigate our library."
- Keep responses under 3 sentences.
- Be professional but friendly.
- Use the same language as the user (English/Sinhala).`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: systemInstruction,
    });

    // Build chat history
    const chatHistory = (history || []).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({ history: chatHistory });
    const response = await sendWithRetry(chat, message);

    res.json({ reply: response });

  } catch (err) {
    console.error('Chatbot error:', err.status, err.message);

    if (err.status === 429) {
      return res.status(429).json({
        message: 'AI is busy right now. Please wait a minute and try again.',
        retryAfter: 60
      });
    }

    res.status(500).json({ message: 'AI service error', error: err.message });
  }
};
