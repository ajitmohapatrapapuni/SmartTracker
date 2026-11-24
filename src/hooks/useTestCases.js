import { testCaseService } from "../services/testCaseService.js";
import { useRecords } from "./useRecords.js";
export const useTestCases = () => useRecords(testCaseService);
