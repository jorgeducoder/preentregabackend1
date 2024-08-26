//import error from "console";
import fs from "fs";

export class cartManager {

    constructor(archivo) {
        this.archivo = archivo;
       

    }

    async getCarts() {
        // Retorna todos los carritos del objeto
       
        try {
            const carts = await fs.promises.readFile(this.archivo, "utf-8");
            
            // Si hago un get del carrito vacio aviso y da error de sintaxis sin crashear, 

            if (carts.trim().length === 0) { console.log("Empty json Carts")};
               
           return JSON.parse(carts)
         

        } catch (error) {
            console.error(error);

            return [];
        }
    }

    
    async getCartbyId(id) {
        // Obtener un carrito por su ID
        try {
            // Obtengo todos los carritos
            const carts = await this.getCarts();
            // Busco en los carts el de igual ID con find para que me devuelva el array
            console.log(carts);
            // Saco un = para que no compare los tipos
            const cart = carts.find((cart) => (parseInt(cart.id) === parseInt(id)));
            //const cart = carts.find((cart) => cart.idcarrito == id);
            console.log("Estoy con este find en getCartbyId: ", cart);
            // Si cart no es undefined lo va a devolver, sino el error
            return cart ? cart : console.error("Cart not found with ID: ", id);

        } catch (error) {
            console.error("Error to obtain cart with ID", error);

        }
    }


    async getcartProducts(id) {
        // Obtener todos los productos de un carrito
        try {
            // Obtengo  todos los carritos
            const carts = await this.getCarts();

            // Busco los productos del carrito con ese id


            const cartp = carts.find((cartp) => (parseInt(cartp.id) === parseInt(id)));
            console.log("Estoy con este find en getCartProducts: ", cartp);
            if (cartp) {
                return cartp.products
                
            }else{
                console.log("Cart not found loocking products");
            }

           // otra opcion return cartp.products ? cartp.products : console.error("No se encontro el cart con ID: ", id);  

        } catch (error) {
            console.error("Error to obtain cart and products with ID", error);

        }
    }

    async addCart() {
        // Agregar un carrito sin productos. 
        // Obtengo un ID numerico
        const id = await this.GetId();
        // Defino la constante para guaardar el id y el array de productos vacios
        const nuevocarrito = { id, products: [] };
        console.log("Este  es el nuevo carrito: ", nuevocarrito)
        
        // Obtengo todos los carritos y pusheo el nuevo
        this.carts = await this.getCarts();
        this.carts.push(nuevocarrito);

        try {
            // this.archivo hace referencia al json, carts es el objeto a guardar, en este caso el objeto carritos
           
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.carts, null, "\t"));
            return nuevocarrito;
        } catch (e) {
            console.error("Error to add cart\n", e);

        }
    }



    async addproductCart(cid, pid, cantidad) {
        // Agregar productos a un carrito
        
        //Traigo todos los carritos
        const carts = await this.getCarts()
        
        // El objetivo es encontrar el indice del carrito a modificar y tambien usar el indice para agregar/actualizar productos
        // Busco el indice del carrito cid
        const buscoindex = carts.findIndex(cart => cart.id == cid);

        if (buscoindex === -1) {  // Si no encuentro el carrito cid
            console.log("At addproductcart Cart not found: ", carts);
        } else {  // Si  encuentro el carrito cid

            // traigo los productos del carrito
            const cartProducts = await this.getcartProducts(cid);
            
            // Busco el indice del producto a agregar actualizar
            console.log("Busco el indice de este producto: ", cartProducts);
            const buscoPindex = cartProducts.findIndex(products => parseInt(products.pid) === parseInt(pid));
            console.log("El indice me da: ", buscoPindex);
            if (buscoPindex === -1) { // si no  encuentro el producto pid lo pusheo

                cartProducts.push({ pid, quantity: cantidad })
                
            } else {  // acualizo la cantidad

                cartProducts[buscoPindex].quantity += cantidad;

            }
            //Actualizo el producto con el indice utilizado  en el carrito
            carts[buscoindex].products = cartProducts;
            try {
                // this. archivo hace referencia al json, carts es el objeto a guardar, en este caso el objeto carritos
                await fs.promises.writeFile(this.archivo, JSON.stringify(carts, null, "\t"));
                console.log("Product added/updated: ", carts[buscoindex].products);
            } catch (e) {
                console.error("Error to added/updated\n", e);
    
            }


            
        }
    }
    async GetId() {
        // Metodo para obtener indices consecutivos para los carritos
        const carts = await this.getCarts();

        if(carts.length > 0) {
           return parseInt(carts[carts.length - 1].id + 1);
    }
        // Si no hay ninguno retorna 1 
        return 1;
    }


}

    


 