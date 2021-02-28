import { Router } from "express";
import { SurveyController } from "./controllers/SurveyController";
import { UserController } from "./controllers/UserController";
import { SendEmailController } from "./controllers/SendEmailController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendEmailController = new SendEmailController();

router.post("/users", userController.create);
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendemail", sendEmailController.execute);

export { router };