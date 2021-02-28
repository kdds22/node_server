import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class SurveysUsersController {
    async create(req: Request, res: Response) {
        const { user_id, survey_id, value } = req.body;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const surveysUsers = surveysUsersRepository.create({
            user_id,
            survey_id,
            value
        });
        await surveysUsersRepository.save(surveysUsers);

        return res.status(201).json(surveysUsers).send();
    }
}

export { SurveysUsersController };