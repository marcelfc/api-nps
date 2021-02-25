import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import UserRepository from '../repositories/UserRepository'
import SurveyRepository from '../repositories/SurveyRepository'
import SurveyUserRepository from '../repositories/SurveyUserRepository'

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
            return response.status(400).json({ error: 'User does not exists!' })
        }

        const existsSurvey = await usersRepository.findOne({
            id: survey_id
        })

        if (!existsSurvey) {
            return response.status(400).json({ error: 'Survey does not exists!' })
        }

        // save survey x user 

        // send email

    }
}

export default SendMailController