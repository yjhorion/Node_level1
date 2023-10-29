export default (err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ errorMessage: err.message });
  }

  return res
    .status(500)
    .json({ errorMessage: "예기치 못한 에러가 발생했습니다" });
};
