import type { Request, Response } from "express";

import { validateIssue } from "./issue.validation";
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
} from "./issue.service";

export const getAllIssuesController = async (req: Request, res: Response) => {
  try {
    const issues = await getAllIssues();

    res.status(200).json({
      success: true,
      message: "Issues retrieved successfully",
      data: issues,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getIssueByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const issue = await getIssueById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue retrieved successfully",
      data: issue,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateIssueController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const existing = await getIssueById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const user = req.user!;

    if (user.role === "contributor") {
      const isOwner = existing.reporter_id === user.id;
      const isOpen = existing.status === "open";

      if (!isOwner || !isOpen) {
        return res.status(403).json({
          success: false,
          message:
            "Contributors can only update their own open issues",
        });
      }
    }

    const { title, description, type } = req.body;

    if (
      title === undefined &&
      description === undefined &&
      type === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }
      if (title.length > 150) {
        return res.status(400).json({
          success: false,
          message: "Title cannot exceed 150 characters",
        });
      }
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.length < 20) {
        return res.status(400).json({
          success: false,
          message: "Description must be at least 20 characters",
        });
      }
    }

    if (type !== undefined && type !== "bug" && type !== "feature_request") {
      return res.status(400).json({
        success: false,
        message: "Invalid issue type",
      });
    }

    const updated = await updateIssue(id, { title, description, type });

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteIssueController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const existing = await getIssueById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const deletedIssue = await deleteIssue(id);

    if (!deletedIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
      data: deletedIssue,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createIssueController = async (req: Request, res: Response) => {
  try {
    const error = validateIssue(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const { title, description, type } = req.body;
    const reporterId = req.user!.id;

    const issue = await createIssue(title, description, type, reporterId);

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
