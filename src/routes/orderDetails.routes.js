import { Router } from "express"
import { prisma } from "../database/db.js"
const router =Router();


router.post('/ordersDetail',async (req,res)=>{

    try {
        const newOrder= await prisma.orderDetail.create({
            data: req.body
        })
        res.status(200).json({success: true, message: "Detalle de orden creada", newOrder})

    } catch (error) {
        res.status(400).json({success: false, message: "No se pudo crear el detalle de la orden"})
    }
})

router.get('/ordersDetail',async (req,res)=>{

    try {
        const orders= await prisma.orderDetail.findMany();
        res.status(200).send(orders);

    } catch (error) {
        res.status(400).json({success: false, message: "No se pudieron recuperar el detalle de la orden"})
    }
})



export default router;