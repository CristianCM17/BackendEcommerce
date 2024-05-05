import { Router } from "express"
import { prisma} from "../database/db.js"

const router =Router();

router.get('/categories',async(req,res)=>{
    const categories= await prisma.category.findMany({
        include: {
            products: true
        }
    })
    res.send(categories);
})

router.put('/categories/:id',async (req, res)=>{
    try {
        const coategoryUpdated  = await prisma.category.update({
            where: {
                idCategory: parseInt(req.params.id)
            },
            data: req.body
        })
        res.status(200).send(`categoria actualizada: ${req.params.id}`)
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;