import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";




const app = express();
// Levanto el servidor
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`));

// Estos son midleware de express 

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Este  midleware para trabajar con las imagenes si utilizo multer

app.use(express.static("public"));

//Use routers se declaran los routers

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);



/*
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
Otra forma de levantar el servidor

*/