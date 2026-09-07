const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      status: "Fail",
      message: result.error.issues[0]?.message || "Validation failed"
    });
  }

  req.body = result.data;
  next();
}

export default validateRequest;