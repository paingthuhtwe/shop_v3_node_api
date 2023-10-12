const router = require("express").Router();
const controller = require("../controllers/permit");
const { PermitSchema, AllSchema } = require("../utils/schema");
const {
  validateBody,
  validateParams,
  validateToken,
} = require("../utils/validator");

router.get("/", validateToken(), controller.all);
router.post(
  "/",
  validateToken(),
  validateBody(PermitSchema.add),
  controller.add
);

router
  .route("/:id")
  .get(validateToken(), validateParams(AllSchema.id, "id"), controller.get)
  .patch(
    validateToken(),
    validateBody(PermitSchema.add),
    validateParams(AllSchema.id, "id"),
    controller.patch
  )
  .delete(validateToken(), validateParams(AllSchema.id, "id"), controller.drop);

module.exports = router;
