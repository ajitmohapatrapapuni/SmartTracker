import { createRecord, deleteRecord, listRecords, updateRecord } from "./resourceService.js";

const table = "bugs";
export const bugService = {
  list: () => listRecords(table),
  create: (values) => createRecord(table, values),
  update: (id, values) => updateRecord(table, id, values),
  remove: (id) => deleteRecord(table, id),
};
