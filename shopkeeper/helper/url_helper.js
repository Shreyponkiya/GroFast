// AUTH
export const REGISTER_API = "/api/user/register";
export const LOGIN_API = "/api/user/login";
export const LOGOUT_API = "/api/user/logout";
export const GET_PROFILE_API = "/api/user/profile";

// CUSTOMER
export const GET_ALL_PRODUCTS_BY_CUSTOMER_API = "/api/customer/get-products";
export const PUT_UPDATE_LOCATION_API = "/api/user/update-address";

// CART
export const POST_ADD_TO_CART_API = "/api/cart/create-cart";
export const GET_CART_BY_ORDER_ID_API = "/api/cart/get-cart";

// PAYMENT
export const POST_CREATE_PAYMENT_INTENT_API = "/api/payment/create-payment-intent";
export const REZORAPAY_GET_KEY_API = "/api/payment/get-key";
export const POST_CREATE_PAYMENT_VERIFY = "/api/payment/verify-payment";

// ORDER
export const POST_CREATE_ORDER_API = "/api/order/placeOrder";
export const GET_ORDER_BY_ORDERID_API = "/api/order/getOrder";
// ADMIN
export const GET_PRODUCT_BY_CATEID_AND_USERID = "/api/admin/get-product";
export const GET_PRODUCT_BY_USERID = "/api/admin/get-products";
export const GET_CATEGORIES_API = "/api/admin/get-categories";
export const POST_ADD_PRODUCT_API = "/api/admin/add-product";
export const POST_ADD_CATEGORY_API = "/api/admin/add-category";

// DELIVERY

export const PUT_UPDATE_DELIVERY_BOY_STATUS_API = "/api/delivery/updateStatus";