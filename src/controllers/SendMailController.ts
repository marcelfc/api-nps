import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import UserRepository from '../repositories/UserRepository'
import SurveyRepository from '../repositories/SurveyRepository'
import SurveyUserRepository from '../repositories/SurveyUserRepository'
import { resolve } from 'path'

import SendMailService from '../services/SendMailService'
import { AppError } from '../errors/AppError'

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body

        const usersRepository = getCustomRepository(UserRepository)
        const surveysRepository = getCustomRepository(SurveyRepository)
        const surveysUsersRepository = getCustomRepository(SurveyUserRepository)

        const existsUser = await usersRepository.findOne({
            email
        })

        if (!existsUser) {
            throw new AppError('User does not exists!')
        }

        const existsSurvey = await surveysRepository.findOne({
            id: survey_id
        })

        if (!existsSurvey) {
            throw new AppError('Survey does not exists!')
        }

        const path = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')


        const surveyUserExists = await surveysUsersRepository.findOne({
            where: { user_id: existsUser.id, value: null },
            relations: ['user', 'survey']
        })

        const variables = {
            name: existsUser.name,
            title: existsSurvey.title,
            description: existsSurvey.description,
            id: '',
            link: process.env.URL_MAIL
        }

        if (surveyUserExists) {
            variables.id = surveyUserExists.id
            await SendMailService.execute(email, existsSurvey.title, variables, path)
            return response.json(surveyUserExists)
        }

        // save survey x user 

        const surveyUser = surveysUsersRepository.create({
            user_id: existsUser.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser)

        variables.id = surveyUser.id

        await SendMailService.execute(email, existsSurvey.title, variables, path)

        return response.json(surveyUser)

        // send email

    }
}

export default SendMailController