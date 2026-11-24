import { createRecord, createRecords, deleteRecord, listRecords, updateRecord } from "./resourceService.js";

const table = "test_cases";
export const testCaseService = {
  list: () => listRecords(table),
  create: (values) => createRecord(table, values),
  createMany: (values) => createRecords(table, values),
  update: (id, values) => updateRecord(table, id, values),
  remove: (id) => deleteRecord(table, id),
};
