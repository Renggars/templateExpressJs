import ApiError from "../utils/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.map((e) => e.message).join(", ");
        return next(new ApiError(400, errorMessage));
      }

      return next(err);
    }
  };
};

export default validate;
