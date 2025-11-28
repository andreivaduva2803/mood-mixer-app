// src/services/aiService.js

export async function generatePlaylistWithGemini(
    apiKey,
    selectedMoods,
    historyIds = [],
    candidates = []
) {
    if (!apiKey || !selectedMoods.length || !candidates.length) {
        return null;
    }

    // 1) Ensure candidates are unique by spotify_id
    const uniqueCandidatesMap = new Map();
    candidates.forEach((p) => {
        if (p.spotify_id && !uniqueCandidatesMap.has(p.spotify_id)) {
            uniqueCandidatesMap.set(p.spotify_id, p);
        }
    });
    const uniqueCandidates = Array.from(uniqueCandidatesMap.values());

    // 2) Prefer playlists not used yet
    const unseen = uniqueCandidates.filter(
        (p) => !historyIds.includes(p.spotify_id)
    );
    const pool = unseen.length >= 3 ? unseen : uniqueCandidates;

    const moodLabels = selectedMoods
        .map((m) => m.label || m.id)
        .join(', ');

    const prompt = `
You are an assistant that selects Spotify playlists from a fixed catalog.

User mood combination: ${moodLabels}

Here is the catalog as a JSON array:
${JSON.stringify(pool)}

Rules:
- Pick 3 playlists from this catalog that best match the mood combination.
- DO NOT invent playlists or spotify_id values. Only use items from the catalog.
- Prefer playlists whose spotify_id is NOT in this list of previously used IDs:
  ${JSON.stringify(historyIds)}
- Return ONLY a JSON array of playlist objects (no explanation text, no markdown fences).
`;

    try {
        const res = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey, // for production, move to a backend
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.9,
                        maxOutputTokens: 512,
                    },
                }),
            }
        );

        if (!res.ok) {
            console.error('Gemini API error', await res.text());
            return null;
        }

        const data = await res.json();
        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

        if (!text) return null;

        // Strip ```json ... ``` if present
        const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, '');
        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (err) {
            console.error('Failed to parse Gemini JSON', err, cleaned);
            return null;
        }

        if (!Array.isArray(parsed)) return null;

        // 3) Validate: keep only playlists that actually exist in the pool
        const poolById = new Map(pool.map((p) => [p.spotify_id, p]));

        const final = parsed
            .map((p) => {
                const base = poolById.get(p.spotify_id);
                if (!base) return null;
                return {
                    ...base,
                    title: p.title || base.title,
                    desc: p.desc || base.desc,
                    analysis: p.analysis || base.analysis,
                };
            })
            .filter(Boolean)
            .slice(0, 3);

        if (!final.length) return null;
        return final;
    } catch (err) {
        console.error('Gemini request failed', err);
        return null;
    }
}
