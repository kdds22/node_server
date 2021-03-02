import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendEmailService from "../services/SendEmailService";


class SendEmailController {
    async execute(req: Request, res: Response) {
        const { email, title } = req.body;

        const userRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const user = await userRepository.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Não encontramos um usuário com o email informado."
            }).send();
        }

        const survey = await surveyRepository.findOne({ title });

        if (!survey) {
            return res.status(400).json({
                message: "Não encontramos a pesquisa informada!"
            });
        }

        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id: survey.id
        });

        await surveyUserRepository.save(surveyUser);

        await SendEmailService.execute(user.name, user.email, survey.title, survey.description);

        return res.status(201).json(surveyUser).send();
    }
}

export { SendEmailController };