import { Router } from "express";
import { productManager } from "../manager/productManager.js";

// Al definir una nueva clase se indica el archivo donde alojar esa clase.
//const PM = new ProductManager("./src/saborescaseros.json");
const PM = new productManager("./src/db/files/products.json");

// Define los metodos para el router de usuarios
const router = Router();


router.get("/", async (req, res) => {
    const {limit} = req.query;
    // get con la opcion de devolver hasta un limite de productos
    let products = await PM.getProduct();
    if (limit) {
       products = products.slice(0, limit);
       }
  
    res.send(products);
});  

router.get('/:pid', async (req, res) => {
    
    let productId = req.params.pid;
    // Convierto el tipo para que no haya problemas en ProductManager con el ===
    const products = await PM.getProductbyId(parseInt(productId));
    res.send({products});
});


router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
   
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails)
     return res.status(400).send({error: "Incomplete values!"});

    await PM.addProduct(req.body);

    res.status(201).send({message: "Product created!"});
});

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    await PM.updateProduct(pid, req.body);
    res.status(200).send({message: "Product updated!"});
})

router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    await PM.deleteProduct(pid);
    res.status(201).send({message: "Product deleted!"});
});

export default router;