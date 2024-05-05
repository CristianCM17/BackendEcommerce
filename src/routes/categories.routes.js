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

export default router;