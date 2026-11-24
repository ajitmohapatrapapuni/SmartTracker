import { callFunction, callFunctionStream } from "./resourceService.js";

export const aiService = {
  generateTestCases: (input, onEvent) => callFunctionStream("generate-testcases", input, onEvent),
  generateDocument: (input) => callFunction("generate-doc", input),
};
