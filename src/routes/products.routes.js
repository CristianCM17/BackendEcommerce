import { Router } from "express"
import { prisma } from "../database/db.js"
const router =Router();


router.get('/products',async(req,res)=>{
   const products= await prisma.product.findMany()
    res.send(products);
})

router.get('/products/:id', async (req,res) => {
    const product = await prisma.product.findFirst({
        where: {
            idProduct: parseInt(req.params.id)
        },
        include: { //con cual tabla se va a relacionar para ver la categoria en el json
            category: true
        }
    });

   return res.send(product);
})

router.delete('/products/:id', async (req,res) => {
    const productDeleted = await prisma.product.delete({
        where: {
            idProduct: parseInt(req.params.id)
        }
    });

   return res.send(productDeleted);
})

router.post('/products',async(req,res)=>{
    const newProduct=await prisma.product.create({
        data: req.body
    });

    res.send(newProduct);
})

router.put('/products/:id',async(req,res)=>{
    const productoUpdated=await prisma.product.update({
        where: {
            idProduct: parseInt(req.params.id)
        },
        data: req.body
    });

   return res.send(productoUpdated);
})

export default router;