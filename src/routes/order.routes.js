import { Router } from "express"
import { prisma } from "../database/db.js"
const router =Router();


router.post('/orders',async (req,res)=>{

    try {
        const newOrder= await prisma.order.create({
            data: req.body
        })
        res.status(200).json({success: true, message: "Orden Creada", newOrder})

    } catch (error) {
        res.status(400).json({success: false, message: "No se pudo crear la orden"})
    }
})

router.get('/orders',async (req,res)=>{

    try {
        const orders= await prisma.order.findMany();
        res.status(200).send(orders);

    } catch (error) {
        res.status(400).json({success: false, message: "No se pudieron recuperar las ordenes"})
    }
})



export default router;