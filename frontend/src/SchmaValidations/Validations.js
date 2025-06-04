import * as Yup from "yup";

const productSchema = Yup.object({
  productCode: Yup.string().required("Product code is required"),
  productName: Yup.string().required("Product name is required"),
  productDescription: Yup.string().required("Description is required"),
  productPrice: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),
  productImage: Yup.string().required("Image field is required"),
  productCategory: Yup.string().required("Please select a category"),
});

const categorySchema = Yup.object({
  categoryCode: Yup.string().required("Category code is required"),
  categoryName: Yup.string().required("Category name is required"),
  categoryDescription: Yup.string().required("Description is required")  
});

export default {productSchema, categorySchema};
