const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const {
  clubController,
  courtController,
  commentController,
} = require("../controllers");

// Club Related Routes
router.post("/club/create", auth(), clubController.createClub);
router.get("/club/:clubId", auth(), clubController.getClubById);
router.put("/club/:clubId/edit", auth(), clubController.editClub);
router.delete("/club/:clubId/delete", auth(), clubController.deleteClub);
router.put("/club/:clubId/join", auth(), clubController.joinClub);
router.delete("/club/:clubId/leave", auth(), clubController.leaveClub);
router.get("/club/:clubId/members", auth(), clubController.getClubMembers);

// Court Related Routes
router.post("/club/courts/create", auth(), courtController.createCourt);
router.put("/club/courts/:courtId/edit", auth(), courtController.editCourt);
router.delete(
  "/club/courts/:courtId/delete",
  auth(),
  courtController.deleteCourt
);
router.get(
  "/club/:clubId/courts/:courtId",
  auth(),
  clubController.getCourtById
);
router.get("/club/:clubId/courts", auth(), clubController.getClubCourts);

// Search Related Route
router.get("/search", clubController.search);

router.get("/", clubController.getAllClubs);

module.exports = router;
