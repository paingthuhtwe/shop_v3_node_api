const router = require("express").Router();
const controller = require("../controllers/role");
const { RoleSchema, AllSchema } = require("../utils/schema");
const {
  validateBody,
  validateParams,
  validateToken,
  validateRole,
} = require("../utils/validator");

router.get("/", validateToken(), validateRole(['Owner', 'Manager', 'Supervisor']), controller.all);
router.post("/", validateToken(), validateRole(['Owner']), validateBody(RoleSchema.add), controller.add);
router.post(
  "/add/permit",
  validateToken(),
  validateRole(['Owner']),
  validateBody(RoleSchema.addPermit),
  controller.roleAddPermit
);
router.delete(
  "/remove/permit",
  validateToken(),
  validateRole(['Owner']),
  validateBody(RoleSchema.addPermit),
  controller.roleRemovePermit
);

router
  .route("/:id")
  .get(validateToken(), validateRole(['Owner', 'Manager', 'Supervisor']), validateParams(AllSchema.id, "id"), controller.get)
  .patch(
    validateToken(),
    validateRole(['Owner']),
    validateBody(RoleSchema.add),
    validateParams(AllSchema.id, "id"),
    controller.patch
  )
  .delete(validateToken(), validateRole(['Owner']), validateParams(AllSchema.id, "id"), controller.drop);

module.exports = router;
