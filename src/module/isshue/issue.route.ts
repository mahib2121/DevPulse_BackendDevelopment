import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createIssueController,
  deleteIssueController,
  getAllIssuesController,
  getIssueByIdController,
  updateIssueController,
} from "./issue.controller";

const router = Router();

router.post("/", authMiddleware, createIssueController);
router.get("/", getAllIssuesController);
router.get("/:id", getIssueByIdController);
router.patch("/:id", authMiddleware, updateIssueController);
router.delete(
  "/:id",
  authMiddleware,
  requireRole("maintainer"),
  deleteIssueController,
);

export default router;
