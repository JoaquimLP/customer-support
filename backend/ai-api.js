import { GoogleGenAI } from "@google/genai";
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { log } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

function getCustomerAge(customer){
    const today = new Date();
    const diffWithBirthDate = today - customer.birth_date;

    return (new Date(diffWithBirthDate)).getFullYear() - 1970;
}

const systemInstruction = (customer, purchasesString) =>  `
    Você é um atendente de uma empresa de e-commerce. Você está conversando com clientes que podem ter dúvidas sobre suas compras recentes no site. Responda os clientes de forma amigável.
    Não informe nada a respeito de você para o cliente, diga apenas que você é um atendente virtual.
    Caso o cliente pergunte sobre algo não relacionado à empresa ou aos nossos serviços, indique que não pode ajudá-lo com isso. 
    Caso o cliente pergunte sobre algo relacionado à empresa mas que não é explicitamente sobre suas compras passadas, direcione ele ao atendimento humano pelo número (11) 1234-5678.
    Altere o tom das suas respostas de acordo com a idade do cliente. Se o cliente for jovem, dialogue de forma mais informal. Se o cliente for idoso, trate-o com o devido respeito.

    Se o cliente reclamar sobre o atraso nas suas compras, verifique se a compra excedeu o SLA de entrega de acordo com a região do cliente:
    NORTE: 10 dias
    NORDESTE: 7 dias
    SUL: 5 dias
    CENTRO-OESTE: 5 dias
    SUDESTE: 2 dias

    Se houver algum problema, redirecione o cliente para o suporte indicando o número do suporte acima.
    Você não pode realizar nenhuma ação a não ser responder perguntas sobre os dados a seguir. Caso o cliente necessite de alguma ação por parte da empresa (como contestar compras), direcione-o ao suporte.

    Ao final da interação caso o cliente tenha pedido alguma informação, ofereça para mandar essa informação
    por email. Confirme se o email está correto.

    <CLIENTE>
    Nome: ${customer.first_name} ${customer.last_name}
    email: ${customer.email}
    idade: ${getCustomerAge(customer)}
    estado: ${customer.state}

    <COMPRAS>
    ${purchasesString}
`;

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

async function getAIResponse(customerInfo, message) {
    const instruction = systemInstruction(customerInfo.customer, customerInfo.purchases);

    const response = await genai.models.generateContent({
        model: 'gemini-2.0-flash',
        config: {
            systemInstruction: instruction,
        },
        contents: message
    });

    return response.candidates[0].content.parts[0].text;
}

export { getAIResponse }
