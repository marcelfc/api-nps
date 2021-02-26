import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import UserRepository from '../repositories/UserRepository'

import * as yup from 'yup'
import { AppError } from '../errors/AppError'

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body

        const schema = yup.object().shape({
            name: yup.string().required('Nome Obrigatório'),
            email: yup.string().email('Email inválido').required('Email obrigatório')
        })

        // if (!(await schema.isValid(request.body))) {
        //     return response.status(400).json({ error: 'validation failed!' })
        // }

        try {
            await schema.validate(request.body)
        } catch (err) {
            throw new AppError(err)
        }

        const usersRepository = getCustomRepository(UserRepository)

        const existsUser = await usersRepository.findOne({
            email
        })

        if (existsUser) {
            throw new AppError('User alredy exists!')
        }

        const user = usersRepository.create({ name, email })

        await usersRepository.save(user)

        return response.status(201).json(user)
    }
}

export default UserController