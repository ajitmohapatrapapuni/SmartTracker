import { requirementService } from "../services/requirementService.js";
import { useRecords } from "./useRecords.js";
export const useRequirements = () => useRecords(requirementService);
