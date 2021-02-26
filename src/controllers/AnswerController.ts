import { Request, Response } from 'express'
import SurveyUserRepository from '../repositories/SurveyUserRepository'
import { getCustomRepository } from 'typeorm'
import { AppError } from '../errors/AppError'

class AnswerController {

    async execute(request: Request, response: Response) {
        const { value } = request.params
        const { u } = request.query

        const surveysUsersRepository = getCustomRepository(SurveyUserRepository)

        const existsSurveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        })

        if (!existsSurveyUser) {
            throw new AppError('Survey user does not exists!');
        }

        existsSurveyUser.value = Number(value)

        await surveysUsersRepository.save(existsSurveyUser)

        return response.json(existsSurveyUser)


    }
}

export default AnswerController