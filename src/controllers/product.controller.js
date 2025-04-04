import { productService } from "../services/products.service.js";

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    // Opciones para la paginación
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true // Para que devuelva elem
    };
    
    //ordenamiento ????
    if (sort) {
      options.sort = { price: sort === "desc" ? -1 : 1 };
    }
    
    // Filtro
    const filter = {};
    if (query) {
      // Puedes filtrar por categoría o disponibilidad según la consigna
      if (query.includes("category:")) {
        filter.category = query.split(":")[1];
      } else if (query.includes("available:")) {
        filter.status = query.split(":")[1] === "true";
      } else {
        // Búsqueda general, por ejemplo por título
        filter.title = { $regex: query, $options: "i" };
      }
    }
    
    const products = await productService.getPaginatedProducts(filter, options);
    
    // Construir URLs para prev y next
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    
    // Formatear la respuesta según lo requerido
    const response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${products.prevPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}` : null,
      nextLink: products.hasNextPage ? `${baseUrl}?limit=${limit}&page=${products.nextPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}` : null
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};