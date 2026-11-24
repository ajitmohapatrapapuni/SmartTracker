import { documentService } from "../services/documentService.js";
import { useRecords } from "./useRecords.js";
export const useDocuments = () => useRecords(documentService);
