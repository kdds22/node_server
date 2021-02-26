import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";



class SurveyController {
    async create(req: Request, res: Response) {
        const { title, description } = req.body;
        const surveyRepository = getCustomRepository(SurveyRepository);

        const isAlreadyExists = await surveyRepository.findOne({ title });

        if (isAlreadyExists) {
            return res.status(201).json({ message: "Já existe uma pesquisa com o título informado." }).send();
        }

        const survey = surveyRepository.create({
            title,
            description,
        });

        await surveyRepository.save(survey);

        return res.status(200).json(survey).send();
    }
}

export { SurveyController };