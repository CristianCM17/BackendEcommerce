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
    });

   return res.send(product);
})

router.delete('/products/:idProduct', async (req, res) => {
    const { idProduct } = req.params;

    try {
        //eliminar registros dependientes en OrderDetail
        await prisma.orderDetail.deleteMany({
            where: { idProduct: parseInt(idProduct) },
        });

      
        const deletedProduct = await prisma.product.delete({
            where: { idProduct: parseInt(idProduct) },
        });
 
        res.status(204).send();
    } catch (error) {
        console.error(error);

        
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Product not found' });
        } else {
            
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});


router.post('/products',async(req,res)=>{
    const data = {
        name: req.body.name,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock),
        image: req.body.image,
        categoryId: parseInt(req.body.categoryId),
        
    }
    const newProduct=await prisma.product.create({
        data: data
    });

    res.send(newProduct);
})

router.put('/products/:id',async(req,res)=>{
    const data = {
        name: req.body.name,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock),
        image: req.body.image,
        categoryId: parseInt(req.body.categoryId),
        
    }
    const productoUpdated=await prisma.product.update({
        where: {
            idProduct: parseInt(req.params.id)
        },
        data: data
    });

   return res.send(productoUpdated);
})

export default router;