import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import * as OpenAiService from './services/openai.js';

const app = express();
const PORT = process.env.PORT || 8081;

const getContent = async (url) => {
    const { data: htmlContent } = await axios.get(url);
    const dom = new JSDOM(htmlContent);
    const paragraphsHtmlElements = Array.from(dom.window.document.body.querySelectorAll('p'));
    const paragraphs = paragraphsHtmlElements.map(element => element.textContent);
    const content = paragraphs.join(' ');

    return content;
}

app.get('/', (request, response) => {
    response.send('API GPT-4');
});

app.get('/summary', async (request, response) => {
    const { url } = request.query;
    const content = await getContent(url)
    const summary = await OpenAiService.getSummary(content);
    response.send(`<strong>Conteúdo:</strong> ${content} <br></br><strong>Resumo:</strong> ${summary} <br><br><strong>Referência:</strong> ${url}`)
});

app.get('/answer', async (request, response) => {
    const { url, question } = request.query;
    const content = await getContent(url)
    const answer = await OpenAiService.getAnswer(content, question);
    response.send(`<strong>Pergunta:</strong> ${question} <br></br><strong>Resposta:</strong> ${answer} <br><br><strong>Referência:</strong> ${url}`)
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});