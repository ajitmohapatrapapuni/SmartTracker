import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", description = "Create your first item to get started." }) {
  return <div className="empty-state"><span className="empty-icon"><Inbox size={22} /></span><strong>{title}</strong><p>{description}</p></div>;
}
