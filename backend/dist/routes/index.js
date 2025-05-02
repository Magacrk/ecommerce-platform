"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const seller_routes_1 = __importDefault(require("./seller.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const cart_routes_1 = __importDefault(require("./cart.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const payment_routes_1 = __importDefault(require("./payment.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const router = (0, express_1.Router)();
// Health check endpoint
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running',
    });
});
// API versioning (future-proofing)
const v1Router = (0, express_1.Router)();
// Register all API routes
v1Router.use('/auth', auth_routes_1.default);
v1Router.use('/products', product_routes_1.default);
v1Router.use('/categories', category_routes_1.default);
v1Router.use('/users', user_routes_1.default);
v1Router.use('/sellers', seller_routes_1.default);
v1Router.use('/orders', order_routes_1.default);
v1Router.use('/cart', cart_routes_1.default);
v1Router.use('/reviews', review_routes_1.default);
v1Router.use('/payments', payment_routes_1.default);
v1Router.use('/uploads', upload_routes_1.default);
// Use v1 router
router.use('/v1', v1Router);
exports.default = router;
//# sourceMappingURL=index.js.map