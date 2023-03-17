import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getSummary = async (content) => {
    const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
            { role: "system", content: "Você é um especialista em resumo de texto. Responda em português" },
            { role: "user", content }
        ]
    });

    return completion.data.choices[0].message.content;
}

const getAnswer = async (content, question) => {
    const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
            { role: "system", content: "Você é um especialista que sabe responder perguntas com base no texto. Responda em português" },
            { role: "assistant", content: `Com base no texto: "${content}". Responda as perguntas.` },
            { role: "user", content: question }
        ]
    });

    return completion.data.choices[0].message.content;
}

export { getSummary, getAnswer };