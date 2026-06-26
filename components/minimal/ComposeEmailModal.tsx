"use client";

import { useState, useRef, useEffect } from "react";
import { X, Minus, Maximize2, Minimize2, Trash, Paperclip, Link2, Smile, Image as ImageIcon, Check } from "lucide-react";
import { useViewStore } from "@/lib/view-store";
import { createMessage } from "@/lib/actions/portfolio.actions";
import { supabase } from "@/lib/supabase";

export default function ComposeEmailModal() {
  const isOpen = useViewStore((state) => state.isComposeOpen);
  const setOpen = useViewStore((state) => state.setComposeOpen);

  const [mode, setMode] = useState<"normal" | "minimized" | "maximized">("normal");
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<{ name: string; url: string; size: string }[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Popover States
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll logic for attachments / scrollable popups
  useEffect(() => {
    if (!isOpen) {
      // Reset modes on close
      setMode("normal");
      setAttachments([]);
      setShowEmojiPicker(false);
      setShowLinkDialog(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function clientUploadFile(file: File, folder: string): Promise<string | null> {
    try {
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}-${file.name.replace(/\s+/g, "_")}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("portfolio")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error(`Client upload failed:`, error);
      return null;
    }
  }

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setBody((prev) => prev + textToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setBody(before + textToInsert + after);

    // Reposition cursor right after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
    }, 0);
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    // Ignore clicks on header action buttons
    if (e.target instanceof HTMLButtonElement || (e.target as HTMLElement).closest("button")) {
      return;
    }
    setMode((prev) => (prev === "minimized" ? "normal" : "minimized"));
  };

  const handleApplyLink = () => {
    if (!linkUrl.trim()) return;
    const displayText = linkText.trim() || linkUrl.trim();
    const formattedLink = ` [${displayText}](${linkUrl.trim()}) `;
    insertTextAtCursor(formattedLink);
    setLinkText("");
    setLinkUrl("");
    setShowLinkDialog(false);
  };

  const uploadAndInsertImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await clientUploadFile(file, "attachments");
      if (url) {
        const imageMarkdown = `\n![${file.name}](${url})\n`;
        insertTextAtCursor(imageMarkdown);
      } else {
        alert("Failed to upload image.");
      }
    } catch (err) {
      alert("Error uploading image: " + String(err));
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await clientUploadFile(file, "attachments");
        if (url) {
          setAttachments((prev) => [
            ...prev,
            { name: file.name, url, size: formatBytes(file.size) },
          ]);
        }
      }
    } catch (err) {
      alert("Error uploading file: " + String(err));
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndInsertImage(file);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          await uploadAndInsertImage(file);
        }
        break;
      }
    }
  };

  const commonEmojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
    "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
    "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘",
    "👌", "🤌", "🤏", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚",
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
    "🔥", "✨", "🎉", "🚀", "🌟", "💡", "💯", "👏", "🙌", "🙏"
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sender.trim() || !body.trim()) {
      alert("Please fill in your email address and message body.");
      return;
    }

    setLoading(true);
    try {
      let finalBody = body.trim();
      if (attachments.length > 0) {
        finalBody += "\n\n--- Attachments ---\n" + attachments.map((att) => `- ${att.name}: ${att.url}`).join("\n");
      }

      await createMessage({
        sender: sender.trim(),
        subject: subject.trim() || "(No Subject)",
        body: finalBody,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSender("");
        setSubject("");
        setBody("");
        setAttachments([]);
        setOpen(false);
      }, 1800);
    } catch (err) {
      alert("Failed to send message: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  // Determine Dialog Styles
  let containerStyle = "fixed z-50 flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-none transition-all duration-300 ";
  
  if (mode === "minimized") {
    containerStyle += "bottom-0 right-0 w-full sm:max-w-sm sm:mr-6 h-[38px] overflow-hidden";
  } else if (mode === "maximized") {
    containerStyle += "inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full max-w-4xl h-[85vh] sm:h-[620px]";
  } else {
    // Normal Floating Box
    containerStyle += "bottom-0 right-0 w-full sm:max-w-xl sm:mr-6 sm:mb-0 h-[80vh] sm:h-[500px]";
  }

  return (
    <>
      {/* Fullscreen Backdrop overlay */}
      {mode === "maximized" && (
        <div 
          className="fixed inset-0 bg-black/55 z-40 backdrop-blur-[1px] transition-opacity duration-300"
          onClick={() => setMode("normal")}
        />
      )}

      <div className={containerStyle}>
        {/* Header - click to toggle minimize */}
        <div 
          onClick={handleHeaderClick}
          className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 cursor-pointer select-none shrink-0"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            New Message
          </span>
          <div className="flex items-center gap-2 text-zinc-500">
            <button 
              type="button" 
              onClick={() => setMode((prev) => (prev === "minimized" ? "normal" : "minimized"))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
              type="button" 
              onClick={() => setMode((prev) => (prev === "maximized" ? "normal" : "maximized"))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title={mode === "maximized" ? "Exit full screen" : "Full screen"}
            >
              {mode === "maximized" ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button 
              type="button" 
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="Close"
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
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md relative animate-in fade-in duration-200">
            {/* Hidden Inputs for File Actions */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoSelect}
              accept="image/*"
              className="hidden"
            />

            {/* From Field */}
            <div className="flex items-center px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900 text-xs">
              <label htmlFor="compose-from" className="text-zinc-400 w-16 font-medium shrink-0">From:</label>
              <input
                id="compose-from"
                type="email"
                required
                disabled={loading}
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Your email address (e.g. name@example.com)"
                className="w-full bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-650 font-medium"
              />
            </div>

            {/* Subject Field */}
            <div className="flex items-center px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-900 text-xs">
              <label htmlFor="compose-subject" className="text-zinc-400 w-16 font-medium shrink-0">Subject:</label>
              <input
                id="compose-subject"
                type="text"
                disabled={loading}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-655 font-medium"
              />
            </div>

            {/* Message Body Area */}
            <div className="flex-1 p-4 min-h-0 overflow-y-auto relative">
              <textarea
                ref={textareaRef}
                required
                disabled={loading}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onPaste={handlePaste}
                placeholder="Compose your email here... (Accepts pasted images)"
                className="w-full h-full bg-transparent text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-655 resize-none font-sans leading-relaxed"
              />

              {uploading && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-bold uppercase tracking-wider shadow-md animate-pulse">
                  Uploading file...
                </div>
              )}
            </div>

            {/* Custom Link dialog popup (Image 5 style) */}
            {showLinkDialog && (
              <div className="absolute bottom-16 left-4 right-4 sm:left-14 sm:right-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 shadow-xl z-20 w-[290px] rounded-none flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-155 text-xs">
                {/* Text representation */}
                <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 px-2 py-1.5 bg-white dark:bg-zinc-950">
                  <span className="text-zinc-400 font-medium select-none w-4 text-center">=</span >
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Text"
                    className="w-full bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-650"
                  />
                </div>
                {/* URL input and Apply button */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 px-2 py-1.5 bg-white dark:bg-zinc-955">
                    <Link2 className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="Type or paste a link"
                      className="w-full bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-650"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyLink}
                    disabled={!linkUrl.trim()}
                    className={`font-bold px-2 py-1.5 transition-colors text-xs uppercase ${
                      linkUrl.trim() 
                        ? "text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" 
                        : "text-zinc-450 dark:text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Custom Emoji popover picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 right-4 sm:left-24 sm:right-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 shadow-xl z-20 w-[240px] rounded-none animate-in fade-in slide-in-from-bottom-2 duration-155">
                <div className="grid grid-cols-8 gap-1 max-h-[140px] overflow-y-auto [scrollbar-width:thin]">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        insertTextAtCursor(emoji);
                      }}
                      className="text-lg hover:bg-zinc-150 dark:hover:bg-zinc-805 p-1 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* List of general attachments */}
            {attachments.length > 0 && (
              <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-150 dark:border-zinc-900/50 flex flex-wrap gap-1.5 shrink-0 max-h-[80px] overflow-y-auto">
                {attachments.map((att, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-1.5 bg-zinc-200/60 dark:bg-zinc-800/80 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 select-none max-w-xs truncate"
                  >
                    <span className="truncate flex-1">{att.name} ({att.size})</span>
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-zinc-500 hover:text-red-500 transition-colors"
                      title="Remove attachment"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-none transition-colors shadow-sm cursor-pointer"
                >
                  {loading ? "Sending..." : "Send"}
                </button>

                {/* Toolbar Actions */}
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-505">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowEmojiPicker(false);
                      setShowLinkDialog(false);
                      fileInputRef.current?.click();
                    }}
                    className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                    title="Attach files"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowEmojiPicker(false);
                      setShowLinkDialog((prev) => !prev);
                    }}
                    className={`p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer ${
                      showLinkDialog ? "bg-zinc-250 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100" : ""
                    }`}
                    title="Insert link"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowLinkDialog(false);
                      setShowEmojiPicker((prev) => !prev);
                    }}
                    className={`p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer ${
                      showEmojiPicker ? "bg-zinc-250 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100" : ""
                    }`}
                    title="Insert emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowEmojiPicker(false);
                      setShowLinkDialog(false);
                      photoInputRef.current?.click();
                    }}
                    className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                    title="Insert photo"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSender("");
                  setSubject("");
                  setBody("");
                  setAttachments([]);
                  setOpen(false);
                }}
                disabled={loading}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors rounded-none cursor-pointer"
                title="Discard draft"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
