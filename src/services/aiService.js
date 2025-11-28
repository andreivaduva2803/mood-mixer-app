
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Calls the Gemini API to generate playlist recommendations based on moods.
 * @param {string} apiKey - The Gemini API key.
 * @param {Array} selectedMoods - Array of selected mood objects.
 * @returns {Promise<Array|null>} - A promise that resolves to an array of 3 playlist objects or null if failed.
 */
export async function generatePlaylistWithGemini(apiKey, selectedMoods) {
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        console.warn("Gemini API key is missing or invalid.");
        return null;
    }

    const moodLabels = selectedMoods.map(m => m.label).join(', ');
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);

    const prompt = `You are an expert music curator with deep knowledge of Spotify's catalog. 

User's mood selection: [${moodLabels}]
Timestamp: ${timestamp}
Variation seed: ${randomSeed}

IMPORTANT INSTRUCTIONS:
1. Generate 3 COMPLETELY DIFFERENT Spotify playlist recommendations that match these moods.
2. Each recommendation MUST be a REAL, EXISTING Spotify editorial playlist.
3. Use ONLY verified Spotify playlist IDs (format: 37i9dQZF1DX...).
4. Ensure maximum variety - never repeat the same playlists.
5. Consider the mood combination to create a unique blend.

Output ONLY valid JSON in this exact format:
{
  "playlists": [
    {
      "title": "Playlist Name",
      "desc": "Brief description matching the mood",
      "analysis": "Why this fits the user's mood selection",
      "spotify_id": "37i9dQZF1DX..."
    }
  ]
}

Do not include any markdown formatting or extra text, just the JSON.`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9, // High temperature for variety
                    response_mime_type: "application/json"
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error:', response.status, response.statusText, errorData);
            throw new Error(`Gemini API request failed: ${response.status}`);
        }

        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!candidate) {
            console.error('Gemini API returned no candidates.');
            return null;
        }

        try {
            // Clean up potential markdown code blocks if the model ignores the mime_type or instruction
            const cleanedJson = candidate.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedData = JSON.parse(cleanedJson);

            if (parsedData.playlists && Array.isArray(parsedData.playlists) && parsedData.playlists.length >= 3) {
                // Return the first 3 playlists
                return parsedData.playlists.slice(0, 3);
            } else {
                console.error('Gemini API returned invalid data structure:', parsedData);
                return null;
            }
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError, candidate);
            return null;
        }

    } catch (error) {
        console.error('Gemini Service Error:', error);
        return null;
    }
}
