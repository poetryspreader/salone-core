import openai from "../../services/openai.js";
import { toFile } from "openai/uploads";
import { Worker } from "../../models/Worker.js";

export async function transcribeVoice(req, res) {

    try {
        const workers = await Worker.find().sort({ name: 1 });

        const workersContext = workers.map(worker => ({
            name: worker.name,
            role: worker.role
        }));

        // console.log(req.file.originalname);


        const transcription = await openai.audio.transcriptions.create({
            file: await toFile(
                req.file.buffer,
                req.file.originalname
            ),
            model: "whisper-1",
            language: "ru"
        });

        const text = transcription.text;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `
                        Ты помощник ресторана.
                        Тебе дают текст из голосовой записи и список работников с именем и должностью.
                        Определи работников из текста.
                        
                        Правила:
                        - ищи по имени, если говорят в добавок должность, проверяй, скорее всего в базе два сотрудника с одинаковым именем и тогда смотри по должности.
                        - учитывай что у нас есть такая должность как бар-менеджер
                        - Не добавляй поле position в ответ, если должность не использовалась.
                        - Учитывай вариативность одного имени: Саша может быть Александр в базе, а Лера - Валерия.
                        - Добавь поле "shiftStart" в формате часа без ведущего нуля (например: "9", а не "09") для начала смены работника, учитывай что смена может начаться с 9, 10, 11, 12, 16, 18 и именно так они записываются, это важно - если с шести, значит 18, не 6.
                        - Возвращай только JSON.
                    `
                },
                {
                    role: "user",
                    content: JSON.stringify({
                        text,
                        workers: workersContext
                    })
                }
            ]
        });

        console.log(response.choices[0].message.content);

        const aiWorkers = JSON.parse(response.choices[0].message.content);

        const result = aiWorkers.map(aiWorker => {
            const worker = workers.find(w => {
                // Если роль указана — сверяем и имя, и роль
                if (aiWorker.role) {
                    return (
                        w.name === aiWorker.name &&
                        w.role === aiWorker.role
                    );
                }

                // Иначе достаточно имени
                return w.name === aiWorker.name;
            });

            return {
                worker: worker?._id,
                baseCoefficient: worker?.baseCoefficient,
                ...(aiWorker.shiftStart && { shiftStart: aiWorker.shiftStart })
            };
        });

        // console.log(result);
        res.json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });

    }
}