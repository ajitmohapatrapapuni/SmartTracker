import { createRecord, deleteRecord, listRecords } from "./resourceService.js";

const table = "documents";
export const documentService = {
  list: () => listRecords(table),
  create: (values) => createRecord(table, values),
  remove: (id) => deleteRecord(table, id),
};
