import { createRecord, deleteRecord, listRecords, updateRecord } from "./resourceService.js";

const table = "projects";
export const projectService = {
  list: () => listRecords(table),
  create: (values) => createRecord(table, values),
  update: (id, values) => updateRecord(table, id, values),
  remove: (id) => deleteRecord(table, id),
};
