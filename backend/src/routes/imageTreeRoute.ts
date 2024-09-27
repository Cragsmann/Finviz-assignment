import { Router } from "express";
import {
  getMainNodes,
  getChildren,
  search,
} from "../controllers/imageTreeController";

const router = Router();

router.get("/", getMainNodes);
router.get("/children", getChildren);
router.get("/search", search);

export default router;
