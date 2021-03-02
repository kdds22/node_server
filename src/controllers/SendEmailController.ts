import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from "path";
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

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsEmail.hbs");

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.EMAIL_URL
        };

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: [{ user_id: user.id }, { value: null }],
            relations: ["user", "survey"],
        });

        if (surveyUserAlreadyExists) {
            await SendEmailService.execute(user.email, survey.title, variables, npsPath);
            return res.status(201).json(surveyUserAlreadyExists).send();
        }


        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id: survey.id
        });

        await surveyUserRepository.save(surveyUser);


        await SendEmailService.execute(user.email, survey.title, variables, npsPath);

        return res.status(201).json(surveyUser).send();
    }
}

export { SendEmailController };