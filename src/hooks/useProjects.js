import { projectService } from "../services/projectService.js";
import { useRecords } from "./useRecords.js";
export const useProjects = () => useRecords(projectService);
