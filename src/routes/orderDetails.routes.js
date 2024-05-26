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
        const orders= await prisma.orderDetail.findMany({
            include: {
                product: true
            }
        });
        res.status(200).send(orders);

    } catch (error) {
        res.status(400).json({success: false, message: "No se pudieron recuperar el detalle de la orden"})
    }
})

router.get('/ordersDetail/:idorder',async (req,res)=>{
    const idOrder = req.params.idorder
    try {
        const orders= await prisma.orderDetail.findMany({
            where: {
                order: {
                    idOrder: parseInt(idOrder)
                }
            },
            include: {
                product: true
            }
        });
        res.status(200).send(orders);

    } catch (error) {
        res.status(400).json({success: false, message: "No se pudieron recuperar el detalle de la orden"})
    }
})

router.get('/totalVentas', async (req, res) => {
    try {
      // Obtener los totales de ventas semanales, mensuales y anuales
      const totalesVentas = {
        semanal: await calcularTotalesVentas('semanal'),
        mensual: await calcularTotalesVentas('mensual'),
        anual: await calcularTotalesVentas('anual'),
      };
  
      res.send(totalesVentas);
    } catch (error) {
      console.error('Error al obtener los totales de ventas:', error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
  });
  
  // Función para calcular los totales de ventas
  async function calcularTotalesVentas(periodo) {
    const fechaActual = new Date();
    let fechaInicio, fechaFin;
  
    // Calcular fechas de inicio y fin según el periodo
    if (periodo === 'semanal') {
      // Obtener la fecha de inicio de la semana actual (lunes)
      fechaInicio = new Date(fechaActual);
      fechaInicio.setDate(fechaInicio.getDate() - fechaInicio.getDay() + 1);
      // La fecha de fin es el día actual
      fechaFin = fechaActual;
    } else if (periodo === 'mensual') {
      // Obtener la fecha de inicio del mes actual
      fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      // La fecha de fin es el día actual
      fechaFin = fechaActual;
    } else if (periodo === 'anual') {
      // Obtener la fecha de inicio del año actual
      fechaInicio = new Date(fechaActual.getFullYear(), 0, 1);
      // La fecha de fin es el día actual
      fechaFin = fechaActual;
    }
  
    // Consultas para obtener los totales de órdenes, clientes y productos
    const totalOrdenes = await prisma.order.count({
      where: {
        date: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    });
  
    const totalClientes = await prisma.user.count();
  
    const totalProductos = await prisma.product.count();
  
    return {
      totalOrdenes,
      totalClientes,
      totalProductos,
    };
  }



export default router;