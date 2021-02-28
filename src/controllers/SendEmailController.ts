import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UserRepository } from "../repositories/UserRepository";


class SendEmailController {
    async execute(req: Request, res: Response) {
        const { email, title } = req.body;

        const userRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const isAlreadyUserExists = await userRepository.findOne({ email });

        if (!isAlreadyUserExists) {
            return res.status(400).json({
                message: "Não encontramos um usuário com o email informado."
            }).send();
        }

        const isAlreadySurveyExists = await surveyRepository.findOne({ title });

        if (!isAlreadySurveyExists) {
            return res.status(400).json({
                message: "Não encontramos a pesquisa informada!"
            });
        }

        const surveyUser = surveyUserRepository.create({
            user_id: isAlreadyUserExists.id,
            survey_id: isAlreadySurveyExists.id
        });

        await surveyUserRepository.save(surveyUser);

        return res.status(201).json(surveyUser).send();
    }
}

export { SendEmailController };