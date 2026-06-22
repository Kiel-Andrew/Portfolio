"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Trash2, MailOpen, RefreshCw, Mail, ChevronRight, X, Clock 
} from "lucide-react";
import { 
  markMessageAsRead, 
  deleteMessage, 
  markMultipleMessagesAsRead, 
  deleteMultipleMessages 
} from "@/lib/actions/portfolio.actions";

interface MessageItem {
  id: string;
  sender: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: Date | string;
}

interface InboxViewProps {
  initialMessages: MessageItem[];
}

export default function InboxView({ initialMessages }: InboxViewProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMessage, setActiveMessage] = useState<MessageItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Formatting date
  function formatMsgDate(dateInput: Date | string): string {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const now = new Date();
    
    // If today, show time
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  // Refresh messages
  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/experiences"); // Just trigger router refresh
      router.refresh();
      // Since it's server-side rendered, a short delay before local state update
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    } catch {
      setRefreshing(false);
    }
  }

  // Checkbox toggle
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === messages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(messages.map((m) => m.id));
    }
  };

  // Bulk actions
  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) return;

    try {
      await deleteMultipleMessages(selectedIds);
      setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      alert("Failed to delete messages: " + String(err));
    }
  }

  async function handleBulkMarkRead() {
    if (selectedIds.length === 0) return;
    try {
      await markMultipleMessagesAsRead(selectedIds);
      setMessages((prev) => 
        prev.map((m) => selectedIds.includes(m.id) ? { ...m, read: true } : m)
      );
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      alert("Failed to mark messages as read: " + String(err));
    }
  }

  // Single message click
  async function handleOpenMessage(msg: MessageItem) {
    setActiveMessage(msg);
    if (!msg.read) {
      try {
        await markMessageAsRead(msg.id);
        setMessages((prev) => 
          prev.map((m) => m.id === msg.id ? { ...m, read: true } : m)
        );
        router.refresh();
      } catch (err) {
        console.error("Failed to mark read:", err);
      }
    }
  }

  // Single delete from detail view
  async function handleDeleteSingle(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setActiveMessage(null);
      router.refresh();
    } catch (err) {
      alert("Failed to delete message: " + String(err));
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Gmail Inbox Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-900/40 border border-zinc-850 rounded-none text-zinc-400">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={messages.length > 0 && selectedIds.length === messages.length}
              onChange={toggleSelectAll}
              disabled={messages.length === 0}
              className="accent-zinc-100 h-3.5 w-3.5"
            />
          </label>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 hover:bg-zinc-800 hover:text-zinc-200 transition-colors rounded-none disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-zinc-100" : ""}`} />
          </button>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
              <button
                onClick={handleBulkMarkRead}
                className="flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] uppercase font-bold tracking-wider text-zinc-300 hover:text-zinc-100 transition-colors"
                title="Mark as Read"
              >
                <MailOpen className="w-3 h-3" />
                <span>Mark Read</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-red-900 hover:bg-red-950/20 text-[10px] uppercase font-bold tracking-wider text-zinc-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
          {messages.filter(m => !m.read).length} Unread \ {messages.length} Total
        </div>
      </div>

      {/* Gmail Inbox List */}
      {messages.length === 0 ? (
        <div className="rounded-none border border-zinc-800 bg-zinc-900/10 p-16 text-center">
          <div className="flex justify-center mb-3 text-zinc-600">
            <Mail className="w-8 h-8" />
          </div>
          <p className="text-xs text-zinc-500">Your inbox is empty.</p>
        </div>
      ) : (
        <div className="w-full border border-zinc-850 bg-zinc-900/10 divide-y divide-zinc-900">
          {messages.map((msg) => {
            const isSelected = selectedIds.includes(msg.id);
            const isUnread = !msg.read;
            
            return (
              <div
                key={msg.id}
                className={`flex items-center px-4 py-3 gap-4 hover:bg-zinc-900/30 transition-colors group cursor-pointer ${
                  isUnread ? "bg-zinc-900/10" : "bg-transparent"
                }`}
              >
                {/* Checkbox */}
                <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(msg.id)}
                    className="accent-zinc-100 h-3.5 w-3.5"
                  />
                </div>

                {/* Main Content Click Row */}
                <div 
                  onClick={() => handleOpenMessage(msg)}
                  className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-1.5 md:gap-6"
                >
                  {/* Sender */}
                  <div className={`w-full md:w-48 shrink-0 truncate text-xs ${
                    isUnread ? "font-bold text-zinc-100" : "text-zinc-400 font-medium"
                  }`}>
                    {msg.sender}
                  </div>

                  {/* Subject & Body Snippet */}
                  <div className="flex-1 min-w-0 flex items-baseline gap-1.5 text-xs">
                    <span className={`truncate ${
                      isUnread ? "font-bold text-zinc-200" : "text-zinc-400 font-normal"
                    }`}>
                      {msg.subject}
                    </span>
                    <span className="text-zinc-500 font-normal truncate hidden sm:inline">
                      — {msg.body}
                    </span>
                  </div>

                  {/* Date & Actions */}
                  <div className="shrink-0 flex items-center gap-3 text-right justify-between md:justify-end">
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {formatMsgDate(msg.createdAt)}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors hidden md:block" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Gmail Email Detail View Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col rounded-none text-zinc-800 dark:text-zinc-200">
            
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 truncate max-w-[80%]">
                Subject: {activeMessage.subject}
              </h2>
              <button
                onClick={() => setActiveMessage(null)}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors rounded-none"
              >
                <X className="w-4 h-4 text-zinc-500 hover:text-zinc-200" />
              </button>
            </div>

            {/* Email Metadata */}
            <div className="p-6 space-y-4 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-900 text-xs">
                <div>
                  <div className="text-zinc-400 font-medium">From:</div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{activeMessage.sender}</div>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(activeMessage.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2 pt-2">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Message
                </h3>
                <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-wrap font-sans">
                  {activeMessage.body}
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="sticky bottom-0 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-900 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-bold text-xs rounded-none transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSingle(activeMessage.id)}
                className="px-4 py-2 border border-zinc-200 dark:border-red-900 bg-transparent hover:bg-red-950/20 text-zinc-500 hover:text-red-400 font-bold text-xs rounded-none transition-colors"
              >
                Delete Message
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
