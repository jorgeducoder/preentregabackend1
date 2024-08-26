
import error from "console";
import fs from "fs";


// lo exporto para usar import
export class productManager {
    
    constructor(archivo) {
        this.archivo = archivo;
        
    }
    
    
    async addProduct(productnew) {
        
        
        // Armo el array del nuevo producto con nueva id mas el array de atributos del nuevo producto
        const newProduct = { id: await this.GetId(), ...productnew, };
        
        
        // Guardo en productos todos los existentes

        const products = await this.getProduct();
        
        // Busco si el nuevo objeto tiene codigo ya existente

        if (products.some(product => product.title === productnew.title)) {
            
            console.error(`Error: Name ${productnew.title} exist.`);
            
        }else{
            // Si no existe el producto con ese codigo lo agrego al array de productos y hago el push de todo el array
            products.push(newProduct);
            try {
                await fs.promises.writeFile(this.archivo, JSON.stringify(products, null, "\t"));
                  
            } catch(e) {
                console.error("Error al agregar el producto\n", e);
                
            }
        }
    
    }

    async getProduct() {
        
              
        try {
            const products = await fs.promises.readFile(this.archivo, "utf-8");
            
            return JSON.parse(products);
        } catch (error) {
            console.error(error);
            
            return [];
        }
    }

    

    async updateProduct (id, productoupd){
        
        // En productos tengo el conjunto de objetos existentes

        const products = await this.getProduct();
        
        // Busco la ID si existe en el array de productos. El findindex devuelve ei index del producto encontrado.
        
        const buscoId = products.findIndex(product => product.id == id);
        if (buscoId === -1) return console.error("ID no encontrado");

        // Hago un split del producto a actualizar mas los atributos del array producto donde vienen las actulizaciones.
        // para cambiar solo lo que viene en req.body
        
        const productActualizado = { ...products[buscoId], ...productoupd,  };        
      

        products[buscoId] = productActualizado;

      // Se genera un nuevo JSON con el objeto actualizado.
        
        await fs.promises.writeFile(this.archivo , JSON.stringify(products , null , "\t"));
        console.log("Product updated! : " , productActualizado);
    }
    
    
    async getProductbyId(id) {
         
         try{
         // Obtengo todos los productos
         const products = await this.getProduct();
         // Busco en los productos el de igual ID con find para que me devuelva el array
        
        const productone = products.find(product => product.id === parseInt(id));
       
         //console.log("Estoy con este find: ", producto)

        return productone ?  productone : console.error ("Product not found: ", id) 

        } catch (error) {
            console.error ("Error to find  product by ID", error);
            
      }}
    
    async deleteProduct(id) {
        try{
            // Obtengo el producto a eliminar

            const productone = await this.getProductbyId(id);
            
            if (productone) {
                //Obtengo todos los productos para eliminar el encontrado
                this.products = await this.getProduct();
                // Con el filter lo elimino del objeto

                const productosnew = this.products.filter(product => product.id != id)

                await fs.promises.writeFile(this.archivo, JSON.stringify(productosnew, null, "\t"));
                console.log("Producto eliminado")
            }else{
                 console.error(" Product not found to delete by ID")
            }

          } catch (error) {
                console.error("Error to delete by ID: ", id)
          }
  
    }  
    async GetId() {
        // Para generar el ID automatico no recibe los productos por parametro, los consulta.
        
        const products = await this.getProduct();
        // toma el id del ultimo usuario, por eso el lenght - 1 Los indices comienzan en 0 y el length devuelve la cantidad de elementos
        if(products.length > 0) {
            return parseInt(products[products.length - 1].id + 1);
        }
        // Si no hay ninguno retorna 1 
        return 1;
    }
}
//Exporto la clase
//module.exports = ProductManager;
// Lo cambio por type module en json
//export default ProductManager;