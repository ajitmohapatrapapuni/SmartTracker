import { bugService } from "../services/bugService.js";
import { useRecords } from "./useRecords.js";
export const useBugs = () => useRecords(bugService);
