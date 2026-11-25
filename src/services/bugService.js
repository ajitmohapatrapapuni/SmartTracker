import { supabase } from "../lib/supabaseClient.js";
import { createRecord, deleteRecord, listRecords, updateRecord } from "./resourceService.js";

const table = "bugs";
const bucket = "bug-attachments";

function assertAttachment(file) {
  const lowerName = file.name.toLowerCase();
  const wordTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const supported = file.type.startsWith("image/")
    || file.type.startsWith("video/")
    || file.type === "application/pdf"
    || wordTypes.includes(file.type)
    || lowerName.endsWith(".doc")
    || lowerName.endsWith(".docx");
  if (!supported) throw new Error(`Unsupported attachment: ${file.name}. Upload images, videos, PDF or Word files.`);
  if (file.size > 20 * 1024 * 1024) {
    throw new Error(`Attachment is too large: ${file.name}. Maximum size is 20 MB.`);
  }
}

async function uploadAttachments(recordId, filesByField) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const userId = sessionData.session?.user?.id;
  if (!userId) throw new Error("Sign in before adding attachments.");

  const attachments = [];
  const files = Object.entries(filesByField).flatMap(([field, files]) =>
    files.map((file) => ({ file, field }))
  );

  for (const { file, field } of files) {
    assertAttachment(file);
    const relativePath = file.webkitRelativePath || file.name;
    const safeName = relativePath.split(/[/\\]/).map((part) =>
      part.replace(/[^a-zA-Z0-9._-]+/g, "-")
    ).join("/");
    const extension = safeName.includes(".") ? safeName.slice(safeName.lastIndexOf(".")) : "";
    const uniqueName = `${crypto.randomUUID()}${extension}`;
    const path = `${userId}/${recordId}/${uniqueName}`;
    const lowerName = file.name.toLowerCase();
    const contentType = file.type
      || (lowerName.endsWith(".doc") ? "application/msword" : "")
      || (lowerName.endsWith(".docx")
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/octet-stream");
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType,
    });
    if (error) throw error;
    attachments.push({
      name: file.name,
      relativePath,
      field,
      path,
      type: contentType,
      size: file.size,
    });
  }
  return attachments;
}

async function removeStoredAttachments(recordId) {
  if (!supabase) return;
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return;
  const prefix = `${userId}/${recordId}/`;
  const { data } = await supabase.storage.from(bucket).list(prefix);
  if (data?.length) {
    await supabase.storage.from(bucket).remove(data.map((item) => `${prefix}${item.name}`));
  }
}

export const bugService = {
  list: () => listRecords(table),
  create: async (values, filesByField = {}) => {
    const bug = await createRecord(table, values);
    const attachments = await uploadAttachments(bug.id, filesByField);
    if (attachments.length) await updateRecord(table, bug.id, { attachments });
    return bug;
  },
  update: async (id, values, filesByField = {}, existingAttachments = []) => {
    const attachments = await uploadAttachments(id, filesByField);
    return updateRecord(table, id, {
      ...values,
      attachments: [...existingAttachments, ...attachments],
    });
  },
  remove: async (id) => {
    await removeStoredAttachments(id);
    await deleteRecord(table, id);
  },
  attachmentUrl: async (attachment) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(attachment.path, 300);
    if (error) throw error;
    return data.signedUrl;
  },
};
