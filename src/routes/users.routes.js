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

router.put('/users/:email',async(req,res)=>{
    const userUpdated=await prisma.user.update({
        where: {
            email: req.params.email
        },
        data: req.body
    });

   return res.status(200).send(userUpdated);
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

router.get('/usuarios/reporte', async (req, res) => {
    try {
      const usuarios = await prisma.user.findMany({
        where: {
            isAdmin: false, // Filtrar los usuarios que no son administradores
          },
        include: {
          orders: {
            include: {
              orderDetails: true,
            },
          },
        },
      });
  
      const usuariosConTotales = usuarios.map(usuario => {
        let totalOrdenes = usuario.orders.length;
        let totalProductosComprados = usuario.orders.reduce((total, order) => {
          return total + order.orderDetails.reduce((acc, orderDetail) => {
            return acc + orderDetail.quantity;
          }, 0);
        }, 0);
  
        return {
          email: usuario.email,
          totalOrdenes,
          totalProductosComprados,
        };
      });
  
      res.send(usuariosConTotales);
    } catch (error) {
      console.error('Error al obtener los datos de los usuarios:', error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
  });

  router.get('/usuarios/reporte/:email', async (req, res) => {
    const { email } = req.params;
  
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
  
    try {
      const usuario = await prisma.user.findUnique({
        where: {
          email: email,   // Filtrar por el correo recibido
          isAdmin: false, // Filtrar los usuarios que no son administradores
        },
        include: {
          orders: {
            include: {
              orderDetails: true,
            },
          },
        },
      });
  
      if (!usuario) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const totalOrdenes = usuario.orders.length;
      const totalProductosComprados = usuario.orders.reduce((total, order) => {
        return total + order.orderDetails.reduce((acc, orderDetail) => {
          return acc + orderDetail.quantity;
        }, 0);
      }, 0);
  
      const usuarioConTotales = {
        email: usuario.email,
        totalOrdenes,
        totalProductosComprados,
      };
  
      res.send([usuarioConTotales]);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
  });

export default router;