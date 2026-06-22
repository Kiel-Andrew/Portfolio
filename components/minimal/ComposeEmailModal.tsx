"use client";

import { useState } from "react";
import { X, Minus, Maximize2, Trash, Paperclip, Link2, Smile, Image as ImageIcon, Lock, Check } from "lucide-react";
import { useViewStore } from "@/lib/view-store";
import { createMessage } from "@/lib/actions/portfolio.actions";

export default function ComposeEmailModal() {
  const isOpen = useViewStore((state) => state.isComposeOpen);
  const setOpen = useViewStore((state) => state.setComposeOpen);

  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sender.trim() || !body.trim()) {
      alert("Please fill in your email address and message body.");
      return;
    }

    setLoading(true);
    try {
      await createMessage({
        sender: sender.trim(),
        subject: subject.trim() || "(No Subject)",
        body: body.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSender("");
        setSubject("");
        setBody("");
        setOpen(false);
      }, 1800);
    } catch (err) {
      alert("Failed to send message: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full sm:max-w-xl sm:mr-6 sm:mb-0 max-h-[90vh] sm:max-h-[600px] flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-none transition-all duration-300">
      {/* Header bar - matching Gmail compose header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
          New Message
        </span>
        <div className="flex items-center gap-2 text-zinc-500">
          <button 
            type="button" 
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-zinc-50 dark:bg-zinc-950 flex-1">
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-none">
            <Check className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Message Sent!
          </p>
          <p className="text-[10px] text-zinc-500">Kiel will read this on his admin panel.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
          {/* To Field */}
          <div className="flex items-center px-4 py-2 border-b border-zinc-100 dark:border-zinc-900 text-xs">
            <span className="text-zinc-400 w-12 font-medium">To</span>
            <input
              type="text"
              disabled
              value="Kiel Andrew <kielesta.gc@gmail.com>"
              className="w-full bg-transparent text-zinc-500 dark:text-zinc-400 focus:outline-none cursor-not-allowed font-medium"
            />
          </div>

          {/* From / Sender Field */}
          <div className="flex items-center px-4 py-2 border-b border-zinc-100 dark:border-zinc-900 text-xs">
            <span className="text-zinc-400 w-12 font-medium">From *</span>
            <input
              type="email"
              required
              disabled={loading}
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Your email address (e.g. name@example.com)"
              className="w-full bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-600"
            />
          </div>

          {/* Subject Field */}
          <div className="flex items-center px-4 py-2 border-b border-zinc-100 dark:border-zinc-900 text-xs">
            <span className="text-zinc-400 w-12 font-medium">Subject</span>
            <input
              type="text"
              disabled={loading}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-600"
            />
          </div>

          {/* Message Body */}
          <div className="flex-1 p-4 min-h-0">
            <textarea
              required
              disabled={loading}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Compose your email here..."
              rows={10}
              className="w-full h-full bg-transparent text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-600 resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Footer toolbar matching Gmail Compose exactly */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-none transition-colors shadow-sm"
              >
                {loading ? "Sending..." : "Send"}
              </button>

              {/* Gmail Action Tooltips */}
              <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                <button type="button" className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <Link2 className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSender("");
                setSubject("");
                setBody("");
                setOpen(false);
              }}
              disabled={loading}
              className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors rounded-none"
              title="Discard draft"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
