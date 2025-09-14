import OpenAI from "openai";

const apiKey = import.meta.env.VITE_API_KEY; // careful with this in extensions!

const client = new OpenAI({
  apiKey: apiKey,
//   dangerouslyAllowBrowser: true // required when calling from browser/extension
});

export async function fetchData(url) {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-nano-2025-04-14",
      input: `Please give me proper 6 hints for this leetcode question having URL : ${url} in plain text point wise, which covers all the techniques and methods needed to solve this question. No need to give any heading for each points, just plain text with numbering`
    });

    // Safely return the text content
    return response.output[0].content[0].text;
  } catch (err) {
    console.error("Error in fetchData:", err);
    throw err;
  }
}
