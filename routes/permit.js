const router = require("express").Router();
const controller = require("../controllers/permit");
const { PermitSchema, AllSchema } = require("../utils/schema");
const {
  validateBody,
  validateParams,
  validateToken,
  validateRole,
} = require("../utils/validator");

router.get("/", validateToken(), validateRole(['Owner', 'Manager', 'Supervisor']), controller.all);
router.post(
  "/",
  validateToken(),
  validateRole(['Owner']),
  validateBody(PermitSchema.add),
  controller.add
);

router
  .route("/:id")
  .get(validateToken(), validateRole(['Owner', 'Manager', 'Supervisor']), validateParams(AllSchema.id, "id"), controller.get)
  .patch(
    validateToken(),
    validateRole(['Owner']),
    validateBody(PermitSchema.add),
    validateParams(AllSchema.id, "id"),
    controller.patch
  )
  .delete(validateToken(), validateRole(['Owner']), validateParams(AllSchema.id, "id"), controller.drop);

module.exports = router;
