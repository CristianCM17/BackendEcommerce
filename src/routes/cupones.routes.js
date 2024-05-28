import { Router } from "express"
import { prisma } from "../database/db.js"
const router =Router();

router.post('/cupones', async (req, res) => {
    try {
      const { codigo, descuento, expiracion } = req.body;
  
      // Verificar si el cupón ya existe en la base de datos
      const existingCoupon = await prisma.cupon.findUnique({
        where: {
          codigo: codigo,
        },
      });
  
      if (existingCoupon) {
        return res.status(400).json({ error: 'El cupón ya existe' });
      }
  
      // Crear el cupón en la base de datos
      const newCoupon = await prisma.cupon.create({
        data: {
          codigo: codigo,
          descuento: descuento,
        },
      });
  
      res.status(200).send(newCoupon);
    } catch (error) {
      console.error('Error al crear el cupón:', error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
  });
  
  // Endpoint para obtener todos los cupones de descuento
  router.get('/cupones', async (req, res) => {
    try {
      const cupones = await prisma.cupon.findMany();
      res.send(cupones);
    } catch (error) {
      console.error('Error al obtener los cupones:', error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
  });
  
  // Endpoint para obtener un cupón específico por su ID
  router.get('/cupones/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
      const cupon = await prisma.cupon.findUnique({
        where: {
            codigo: parseInt(codigo),
        },
      });
  
      if (!cupon) {
        return res.status(404).json({ error: 'Cupón no encontrado' });
      }
  
      res.send(cupon);
    } catch (error) {
      console.error('Error al obtener el cupón:', error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
  });
  
  // Endpoint para actualizar un cupón específico por su ID
  router.put('/cupones/:idCupon', async (req, res) => {
    const { idCupon } = req.params;
    const { codigo, descuento } = req.body;
  
    try {
      const updatedCoupon = await prisma.cupon.update({
        where: {
            idCupon: parseInt(idCupon),
        },
        data: {
          codigo: codigo,
          descuento: descuento,
        },
      });
  
      res.send(updatedCoupon);
    } catch (error) {
      console.error('Error al actualizar el cupón:', error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
  });
  
  // Endpoint para eliminar un cupón específico por su ID
  router.delete('/cupones/:idCupon', async (req, res) => {
    const { idCupon } = req.params;
  
    try {
      const deletedCoupon = await prisma.cupon.delete({
        where: {
            idCupon: parseInt(idCupon),
        },
      });
  
      res.send(deletedCoupon);
    } catch (error) {
      console.error('Error al eliminar el cupón:', error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
  });
export default router;