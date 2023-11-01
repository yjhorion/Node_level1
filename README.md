# Node_level1
CRUD level1

4000번 포트 사용

/** 물품추가 **/
POST // http:/yjhorion.co.kr:4000/api/products
{
	"productName" : "상품예시1",
	"description" : "상품정보",
	"seller" : "유재현",
	"password" : "abc123"
}

/** 상품 목록 조회 **/
GET // http://yjhorion.co.kr:4000/api/products

/** 상품 목록 상세 조회 **/
GET // http://yjhorion.co.kr:4000/api/products/:pName

/** 상품 내용 변경 **/
PATCH // http://yjhorion.co.kr:4000/api/products/:pName
{
	"productName" : "변경된 상품예시3",
	"description" : "변경된 상품정보",
	"productStatus" : "SOLD_OUT",
	"password" : "abc123"
}

/** 상품 목록 선택 삭제 **/
DELETE // http://yjhorion.co.kr:4000/api/products/:pName
