import { Router } from "express";
import { cartManager } from "../manager/cartManager.js";
import { productManager } from "../manager/productManager.js";

// Define los nuevos objetos CM y PM con los metodos y datos del json
const CM = new cartManager("./src/db/files/carts.json");

// La nueva clase PM en principio la necesito para ver si el producto que se ingresa para incorporar la carrito esta en la clase productos
const PM = new productManager("./src/db/files/products.json");
 
// Define los metodos para el router de usuarios
const router = Router();






router.get("/", async (req, res) => {
    // Desde la raiz se obtienen todos los carritos
    
    const { limit } = req.query;

    let carts = await CM.getCarts();
    if (limit) {
        carts = carts.slice(0, limit);
    }

    res.send(carts);
});

router.get('/:cid', async (req, res) => {
    // Dado el id de un carrito lo muestra
    let cartId = req.params.cid;
    const cart = await CM.getcartProducts(cartId);
    res.send({ cart });
});



router.post("/", async (req, res) => {
    //Agregar un carrito vacio
    try {

        const response = await CM.addCart();
        res.json(response);
    } catch (error) {
        res.send("Error al crear carrito")
    }
})



router.post("/:cid/productos/:pid", async (req, res) => {
    // Dado un id de carrito y un producto lo agrega, y si existe lo actualiza con la cantidad que se recibe en el body
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    console.log(cid, pid, quantity);
    if (!cid || !pid || !quantity) 

        // Permite crear un carrito con la cantidad del body
        return res.status(400).send({ error: "Faltan datos para crear o agregar al carrito" });

    const product = await PM.getProductbyId(pid)
    if (!product) {
        return res.status(404).send({ error: "Producto no existe en post" })};

    const cart = await CM.getCartbyId(cid);
    if (!cart) 
       return res.status(404).send({ error: "Carrito no existe en post" });
        
    await CM.addproductCart(cid, pid, quantity);
        
    const statusCode = res.statusCode; // Obtener el código de estado
    console.log('Status Code:', statusCode); // Mostrar en la consola
        
    if (res.status(201).send({ message: "Producto creado correctamente!" }));
    
});


export default router;