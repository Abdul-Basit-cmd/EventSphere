const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ status: "Error", message: "Invalid ID format" });
  }

  if (err.code === 11000) {
    return res.status(400).json({ status: "Error", message: "Duplicate record already exists" });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({
      status: "Error",
      message: "Validation failed",
      errors: err.errors.map(e => ({ field: e.path.join("."), message: e.message }))
    });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).json({ status: "Error", message: "Internal server error" });
};

export default globalErrorHandler;
