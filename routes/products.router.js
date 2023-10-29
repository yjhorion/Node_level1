import express from "express";
import products from "../schemas/products.schemas.js";
import joi from "joi";

const router = express.Router();

const createdTodoSchema = joi.object({
  productName: joi.string().min(1).max(50).required(), //.unique() 고유성 검사는 db수준에서 이루어져야한다.
  description: joi.string(),
  seller: joi.string().required(),
  password: joi.string().required(),
  productStatus: joi.string(),
  writtenAt: joi.date(),
});

// 상품등록 API
router.post("/products", async (req, res, next) => {
  try {
    // const {productName, description, seller, password, productStatus, writtenAt} = req.body;
    const validation = await createdTodoSchema.validateAsync(req.body);
    const {
      productName,
      description,
      seller,
      password,
      productStatus,
      writtenAt,
    } = validation;
    const existingProduct = await products
      .find({ productName: productName })
      .exec();

    if (existingProduct.length) {
      return res.status(400).json({ errorMessage: "이미 등록된 상품입니다" });
    }

    /** joi와 중복되는 검사 제거
         if(!productName) {
             return res.status(400).json({ errorMessage: "상품의 이름은 필수요소입니다"})
         }
     
         if(!seller || !password ) {
             return res.status(400).json({ errorMessage: "판매자명과 비밀번호는 필수요소입니다"})
         }
         * **/

    const product = new products({
      productName,
      description,
      seller,
      password,
      productStatus,
      writtenAt,
    });
    await product.save();

    return res.status(201).json({ product: product });
  } catch (error) {
    next(error);
  }
});

// 상품 목록 조회 API
router.get("/products", async (req, res, next) => {
  const product_list = await products.find().sort("-writtenAt").exec();
  if (!product_list.length) {
    return res
      .status(404)
      .json({ errorMessage: "아직 등록된 상품이 없습니다" });
  }
  return res.status(200).json({ product_list });
});

// 상품 상세 조회 API
router.get("/products/:pName", async (req, res, next) => {
  const { pName } = req.params;
  const product_by_name = await products
    .find({ productName: pName })
    .select("name description productStatus writtenAt")
    .exec();

  if (!product_by_name.length) {
    return res
      .status(400)
      .json({ errorMessage: "등록되지 않은 상품명입니다." });
  }
  return res.status(200).json({ product: product_by_name });
});

// 상품 정보 수정 API
router.patch("/products/:pName", async (req, res, next) => {
  const { pName } = req.params;
  const { productName, description, productStatus, password } = req.body;

  const target_product = await products.findOne({ productName: pName }).exec();

  if (productStatus !== "FOR_SALE" && productStatus !== "SOLD_OUT") {
    return res.status(404).json({
      errorMessage:
        "상품상태(productStatus)는 FOR_SALE 또는 SOLD_OUT 중에 선택하여야 합니다.",
    });
  }

  if (!target_product) {
    return res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다" });
  }

  if (target_product.password !== password) {
    return res
      .status(400)
      .json({ errorMessage: "비밀번호가 올바르지 않습니다" });
  } else {
    target_product.productName = productName; // 이부분을 좀 더 간결하게는 안될까?
    target_product.description = description;
    target_product.productStatus = productStatus;
    await target_product.save();
    return res.status(200).json({ message: "정상적으로 수정되었습니다" });
  }
});

// 상품 삭제 API

router.delete("/products/:pName", async (req, res, next) => {
  const { pName } = req.params;
  const { password } = req.body;

  const target_product = await products.findOne({ productName: pName }).exec();

  if (!target_product) {
    return res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다" });
  }

  if (target_product.password !== password) {
    return res
      .status(400)
      .json({ errorMessage: "비밀번호가 올바르지 않습니다" });
  } else {
    await products.deleteOne({ productName: pName });
    return res.status(200).json({ message: "정상적으로 삭제되었습니다" });
  }
});

export default router;

// if 문들을 app.js 에 middleware로 옮겨 코드를 간소화할것. (if문을 미들웨어로 옮기고싶은데 가능한지?, 주어진 joi 옵션에 해당하지 않는것들은..? 더 복잡한 로직들이나 기준이 있다면?)
