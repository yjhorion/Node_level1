import express from "express";
import connect from "./schemas/index.js";
import productsRouter from "./routes/products.router.js";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware.js";

const app = express();
const PORT = 4000;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

// app.get('/api', (req, res) => {
//     if (!product_by_name.length) {
//         return res.status(400).json({errorMessage : '등록되지 않은 상품명입니다.'})
//     }
// })

app.use("/api", [router, productsRouter]);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
