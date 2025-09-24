import OpenAI from "openai";

const apiKey = import.meta.env.VITE_API_KEY2; // careful with this in extensions!

const client = new OpenAI({
  apiKey: apiKey,
//   dangerouslyAllowBrowser: true // required when calling from browser/extension
});



export async function fetchData(url) {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-nano-2025-04-14",
      input: [
        {
          role: "system",
          content: "You are a JSON-only API. Always return valid JSON that matches the schema."
        },
        {
          role: "user",
          content: `Provide clear step-by-step hints to solve the LeetCode problem at this URL: ${url}. 
Each hint should be a separate string in the array.`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "LeetCodeHints",   // ✅ required
          schema: {                // ✅ required (not json_schema)
            type: "object",
            properties: {
              hints: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["hints"],
            additionalProperties: false
          }
        }
      },
      temperature: 0
    });

    if (response.output_parsed) {
      return response.output_parsed;
    }

    // Parsed JSON is available directly here
     return JSON.parse(response.output_text);

  } catch (err) {
    console.error("Error in fetchData:", err);
    throw err;
  }
}