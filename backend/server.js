import express from "express"
import cors from "cors"

import {getCustomerInfo} from "./database-api.js"
import {getAIResponse} from "./ai-api.js"



const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.post("/support", async (req, res) => {
    try {
        console.log('Incoming /support request', req.body);

        const { email, message } = req.body ?? {};

        if (!email || !message) {
            return res.status(400).json({
                error: "Requisição inválida: informe email e message."
            });
        }

        const info = await getCustomerInfo(email);

        if (!info) {
            return res.status(404).json({
                error: "Cliente não encontrado."
            });
        }

        const ai = await getAIResponse(info, message);
        console.log('AI response', ai);

        return res.json({ response: ai });
    } catch (error) {
        console.error("Erro ao processar requisição /support:", error);
        return res.status(500).json({
            error: "Erro interno ao processar a solicitação."
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
})
