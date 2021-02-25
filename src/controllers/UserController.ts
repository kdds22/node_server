import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../models/User";

class UserController {
    async create(req: Request, res: Response) {
        const { name, email } = req.body;
        const usersRepository = getRepository(User);

        const isAlreadyExists = await usersRepository.findOne({ email });

        if (isAlreadyExists) {
            return res.status(400).json({ message: "Já possui um usuário com o email informado..." }).send();
        }

        const user = usersRepository.create({
            name,
            email
        });
        await usersRepository.save(user);

        return res.json(user).send();
    }
}

export { UserController };