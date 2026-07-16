import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key (GEMINI_API_KEY) is not configured on the server." },
        { status: 500 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { image, mimeType, genre } = body;

    // 3. Input Validation
    if (!image) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }
    
    const validMimeTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!mimeType || !validMimeTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: "Invalid image type. Supported: PNG, JPEG, WebP." },
        { status: 400 }
      );
    }

    const validGenres = ["whimsical", "adventure", "mystery", "emotional", "fantasy", "scifi", "nostalgic", "poetic"];
    if (!genre || !validGenres.includes(genre.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid story style selected." },
        { status: 400 }
      );
    }

    // 4. Initialize Gemini client
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

    // 5. Structure prompt and system instructions
    const systemInstruction = 
      "You are a master storyteller who writes beautiful, atmospheric short stories inspired by user-uploaded images. " +
      "Analyze the details, subjects, colors, lighting, and perceived mood of the image. " +
      "Write a short story that reflects the selected storytelling style (genre). " +
      "The response must be valid JSON matching the schema, with a title, story content, and exactly three mood tags.";

    const prompt = `Write a short story based on this image.
Selected Style/Genre: ${genre.toUpperCase()}

Requirements:
1. Write a creative, engaging title that fits the theme.
2. The story should be between 100 and 220 words. Focus on vivid imagery, sensory details, and depth.
3. The story must capture the atmosphere and visual cues of the image (such as colors, objects, lighting, and perceived emotions).
4. Keep the writing style matching the selected genre:
   - Whimsical: Playful, magical, lighthearted, fairy-tale like.
   - Adventure: Action-oriented, exploratory, daring, inspiring.
   - Mystery: Intriguing, atmospheric, suspenseful, questioning, full of secrets.
   - Emotional: Deeply moving, touching, reflective, melancholy.
   - Fantasy: Epic, mythical, magical realms, legendary creatures.
   - Sci-Fi: Futuristic, space wonder, advanced technology, cosmic curiosity.
   - Nostalgic: Vintage memories, classic prose, old-fashioned reflections.
   - Poetic: Dreamy, lyrical fragments, deep sensory and abstract descriptions.
5. Provide exactly 3 appropriate mood tags (e.g. "Serene", "Melancholy", "Adventurous") as an array of strings.`;

    // 6. Generate content with structured JSON output
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          inlineData: {
            mimeType,
            data: image,
          },
        },
        prompt,
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            story: { type: "string" },
            moods: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["title", "story", "moods"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response content received from the AI model.");
    }

    // 7. Parse output and return
    const parsedData = JSON.parse(responseText);
    
    // Double check the fields exist
    if (!parsedData.title || !parsedData.story || !Array.isArray(parsedData.moods)) {
      throw new Error("Response structure was incomplete.");
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Error in generate-story route:", error);
    
    // Try to extract detailed error message if possible
    const errorMessage = error?.message || "An unexpected error occurred during story generation.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
