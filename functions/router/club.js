const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { clubController, courtController } = require("../controllers");

// Club Related Routes
router.post("/create", auth(), clubController.createClub);
router.get("/:clubId", clubController.getClubById);
router.put("/:clubId/edit", auth(), clubController.editClub);
router.delete("/:clubId/delete", auth(), clubController.deleteClub);
router.put("/:clubId/join", auth(), clubController.joinClub);
router.delete("/:clubId/leave", auth(), clubController.leaveClub);
router.get("/:clubId/members", auth(), clubController.getClubMembers);
router.get("/", clubController.getAllClubs);

// Court Related Routes
router.post("/court/create", auth(), courtController.createCourt);
router.put("/:clubId/court/:courtId/edit", auth(), courtController.editCourt);
router.delete(
  "/:clubId/court/:courtId/delete",
  auth(),
  courtController.deleteCourt
);
router.get("/court/:courtId", clubController.getCourtById);
router.get("/:clubId/courts", clubController.getClubCourts);

// Search Related Route
router.get("/search", clubController.search);

module.exports = router;
