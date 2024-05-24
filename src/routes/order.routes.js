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
        const orders= await prisma.order.findMany({
            include: {
                user: true
            }
        });
        res.status(200).send(orders);

    } catch (error) {
        res.status(400).json({success: false, message: "No se pudieron recuperar las ordenes"})
    }
})

router.get('/orders/:email', async (req, res) => {
    try {
    const email = req.params.email;
    const orders = await prisma.order.findMany({
        where: {
            user: {
                email: email
            }
        },
        include: {
            user: true
        }
    });

    res.status(200).send(orders); 
    } catch (error) {
    res.status(500).json({ success: false, message: "email no encontrado"})
    }
})



export default router;