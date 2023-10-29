import mongoose, { now } from "mongoose";

// 상품명 name, 작성 내용 description, 작성자명 seller, 비밀번호 password, 상품상태 status
const products_schema = new mongoose.Schema({
  productName: { type: String, required: true, unique: true },
  description: String,
  seller: { type: String, required: true },
  password: { type: String, required: true },
  productStatus: {
    type: String,
    enum: ["FOR_SALE", "SOLD_OUT"],
    default: "FOR_SALE",
  },
  writtenAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model("Defaults", products_schema);
