import { Router } from 'express';
import { createProduct, getAllProducts, getProductById,updateProduct, deleteProduct } from '../controllers/productController';

const router = Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);


export default router;



// import { Router } from "express";
// import {
//     getAllProducts,
//     getProductById,
//     createProdcut,
//     updateProduct,
//     deleteProduct,
// } from '../controllers/productController';

// const router = Router();

// router.get('/', getAllProducts);
// router.get('/:id', getProductById);
// router.post('/', createProdcut);
// router.put('/:id', updateProduct);
// router.delete('/:id',deleteProduct);

// export default router;