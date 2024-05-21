import { Router } from "express"
import { prisma } from "../database/db.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const router = Router();

router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).json({ success: false,message: "Error al recuperar usuarios" })
    }
})

router.get('/users/:email', async (req, res) => {
        try {
        const email = req.params.email;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        res.status(200).send(user); 
        } catch (error) {
        res.status(500).json({ success: false, message: "usuario no encontrado"})
        }
})

router.post('/users', async (req, res) => {

    try {
        const newUser = await prisma.user.create({
            data: {
                name: req.body.name,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                phone: req.body.phone,
                street: req.body.street,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                postcode: req.body.postcode
            }
        });
        res.status(200).send(newUser);

    } catch (error) {
        res.status(500).json({ success: false })
    }

})

router.post('/login', async (req, res) => {
    const secret = process.env.SECRET;
    try {
        let user = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        })
        if(!user) {
            return res.status(400).send('User not found.');
        }

        if (user && bcrypt.hashSync(req.body.password,user.password)  ) {
            const token = jwt.sign(
                {
                    userId: user.idUser,
                    isAdmin: user.isAdmin,
                    /*permissions: [
                        //"user:admin",
                        "user:read",
                        "user:write"
                    ]*/
                },
                secret,
                {expiresIn : '1d'}
            )
            res.status(200).send({user: user.email , token: token})
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "password incorrecto"
        })
    }
})

export default router;