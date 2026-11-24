import { supabase } from "../lib/supabaseClient.js";

function client() {
  if (!supabase) throw new Error("Supabase is not configured. Add the values from .env.example to your .env file.");
  return supabase;
}

export async function listRecords(table) {
  const { data, error } = await client().from(table).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createRecord(table, values) {
  const { data, error } = await client().from(table).insert(values).select().single();
  if (error) throw error;
  return data;
}

export async function createRecords(table, values) {
  const { data, error } = await client().from(table).insert(values).select();
  if (error) throw error;
  return data ?? [];
}

export async function updateRecord(table, id, values) {
  const { data, error } = await client().from(table).update(values).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRecord(table, id) {
  const { error } = await client().from(table).delete().eq("id", id);
  if (error) throw error;
}

async function throwFunctionError(error, name) {
  let serverMessage = "";
  const context = error.context;

  if (context instanceof Response) {
    try {
      const payload = await context.clone().json();
      serverMessage = payload?.error || payload?.message || "";
    } catch {
      try {
        serverMessage = (await context.clone().text()).trim();
      } catch {
        serverMessage = "";
      }
    }
  }

  throw new Error(serverMessage || error.message || `The ${name} service is unavailable.`);
}

export async function callFunction(name, body) {
  const { data, error } = await client().functions.invoke(name, { body });
  if (error) {
    await throwFunctionError(error, name);
  }
  return data;
}

export async function callFunctionStream(name, body, onEvent) {
  const { data, error } = await client().functions.invoke(name, { body });
  if (error) await throwFunctionError(error, name);

  let testCases = null;
  function dispatch(frame) {
    let eventName = "message";
    const dataLines = [];
    for (const line of frame.split("\n")) {
      if (line.startsWith("event:")) eventName = line.slice(6).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
    }
    if (!dataLines.length) return;

    const payload = JSON.parse(dataLines.join("\n"));
    if (eventName === "error") throw new Error(payload.error || `The ${name} service failed.`);
    if (eventName === "complete") testCases = payload.testCases;
    onEvent?.(eventName, payload);
  }

  if (data instanceof Response) {
    if (!data.body) throw new Error(`The ${name} service returned an empty response.`);
  } else if (typeof data === "string") {
    let payload;
    try {
      payload = JSON.parse(data);
    } catch {
      // A text/event-stream response may be buffered if an intermediary changes its content type.
    }

    if (payload !== undefined) {
      if (payload?.error) throw new Error(payload.error);
      if (Array.isArray(payload?.testCases)) return { testCases: payload.testCases };
      throw new Error(`The ${name} service returned an unexpected response. Redeploy the Edge Function and try again.`);
    }

    for (const frame of data.replace(/\r\n/g, "\n").split("\n\n")) {
      if (frame.trim()) dispatch(frame);
    }
  } else if (data && typeof data === "object") {
    if (data.error) throw new Error(data.error);
    if (Array.isArray(data.testCases)) return { testCases: data.testCases };
    throw new Error(`The ${name} service returned an unexpected response. Redeploy the Edge Function and try again.`);
  } else {
    throw new Error(`The ${name} service returned an empty response.`);
  }

  if (data instanceof Response) {
    const reader = data.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        buffer = (buffer + decoder.decode(value, { stream: !done })).replace(/\r\n/g, "\n");
        let boundary = buffer.indexOf("\n\n");
        while (boundary >= 0) {
          dispatch(buffer.slice(0, boundary));
          buffer = buffer.slice(boundary + 2);
          boundary = buffer.indexOf("\n\n");
        }
        if (done) break;
      }
      if (buffer.trim()) dispatch(buffer);
    } finally {
      reader.releaseLock();
    }
  }

  if (!Array.isArray(testCases)) throw new Error(`The ${name} service ended before generation completed.`);
  return { testCases };
}
