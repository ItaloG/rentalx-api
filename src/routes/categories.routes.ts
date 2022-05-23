import { Router } from 'express'

import { Category } from '../model/Category'

const categoriesRoutes = Router()

categoriesRoutes.post("/", (req, res) => {
    const { name, description } = req.body


    return res.status(201).json(category)
})

export { categoriesRoutes }
