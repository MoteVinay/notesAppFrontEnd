import axios from "../api/axios";
import { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useTheme from "../hooks/useTheme";

import { Pencil, Trash2, MoreHorizontal, ChevronUp } from "lucide-react";

const NotesDisplay = () => {
  const { theme } = useTheme(); // true = light, false = dark
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [notesUp, setNotesUp] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { auth, setAuth } = useAuth();
  const formRef = useRef(null);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSuccess = (msg) => toast.success(msg, { position: "top-right" });
  const handleError = (err) => toast.error(err, { position: "top-right" });

  const normalizeNote = (n) => {
    const id = n?.note_id ?? n?.id ?? n?._id ?? null;
    return { ...n, id };
  };

  const scrollToForm = () => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get("/notes", { withCredentials: true });
      const raw = res?.data?.Notes ?? [];
      const normalized = raw.map(normalizeNote);
      setNotes(normalized);
    } catch (err) {
      setNotes([]);
      handleError("Failed to load notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [auth, notesUp]);

  const handleAddNoteClick = () => {
    setFormOpen((prev) => !prev);
    setEditingId(null);
    setEditingNote(null);
    setNewNote("");
    scrollToForm();
  };

  const handleSubscription = async () => {
    try {
      const { data } = await axios.post(
        "/admin/subscribe",
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message || "Subscribed successfully!", {
          position: "top-right",
        });
        setAuth({ ...auth, subscribed: true });
        // Optionally update state here
      } else {
        toast.error(data.message || "Subscription failed.", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("Error subscribing.", { position: "top-right" });
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote?.trim()) {
      handleError("Note cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        const { data } = await axios.put(
          `/notes/${editingId}`,
          { note: newNote },
          { withCredentials: true }
        );
        if (data?.success) {
          handleSuccess(data.message || "Note updated!");
          setEditingId(null);
          setEditingNote(null);
          setNewNote("");
          setFormOpen(false);
          setNotesUp((s) => !s);
        } else {
          handleError(data?.message || "Failed to update note.");
        }
      } else {
        const { data } = await axios.post(
          "/notes",
          { note: newNote },
          { withCredentials: true }
        );
        if (data?.success) {
          handleSuccess(data.message || "Note added!");
          setNewNote("");
          setFormOpen(false);
          setNotesUp((s) => !s);
        } else {
          handleError(data?.message || "Failed to add note.");
        }
      }
    } catch (err) {
      handleError(err?.response?.data?.message || "Error submitting note.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!id) {
      handleError("Cannot delete note: missing id.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.delete(`/notes/${id}`, {
        withCredentials: true,
      });
      if (data?.success) {
        handleSuccess(data.message || "Note deleted!");
        setNotesUp((s) => !s);
      } else {
        handleError(data?.message || "Failed to delete note.");
      }
    } catch (err) {
      handleError("Error deleting note.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = (note) => {
    const id = note?.note_id ?? note?.id ?? note?._id ?? null;
    if (!id) {
      handleError("Cannot edit note: missing id.");
      return;
    }
    setEditingId(id);
    setEditingNote(note);
    setNewNote(note.note ?? "");
    setFormOpen(true);
    scrollToForm();
  };

  return (
    <div
      className={` max-w-3xl mx-auto mt-6 p-4 ${
        theme ? "bg-white text-gray-900" : "bg-gray-900 text-gray-100"
      }`}
    >
      <ToastContainer />
      <div className="flex mb-6 justify-around items-center gap-4">
        <h2 className="font-bold text-2xl">
          Notes from tenant_id {auth.tenant_id}
        </h2>
        {console.log("Auth in NotesDisplay:", auth)}
        {auth.role == 1 &&
          (auth.subscribed ? (
            <h2 className="font-bold text-2xl">Thanks for subscribing</h2>
          ) : (
            <button
              className="bg-sky-500 rounded-2xl px-1.5"
              onClick={handleSubscription}
            >
              {" "}
              subscribe{" "}
            </button>
          ))}
      </div>
      <div className="space-y-6">
        {notes.length === 0 ? (
          <p className="text-center italic text-gray-500 dark:text-gray-400 mt-10">
            No notes available or you are logged out
          </p>
        ) : (
          notes.map((note) => {
            const id = note.id;
            const isExpanded = expanded[id];
            const text = note.note ?? "";
            const isLong = text.length > 120;
            const displayedText = isExpanded
              ? text
              : text.slice(0, 120) + (isLong ? "..." : "");

            return (
              <div
                key={id ?? Math.random()}
                className={`relative border shadow-md rounded-3xl p-6 hover:shadow-lg transition duration-300 ${
                  theme
                    ? "bg-white border-gray-300"
                    : "bg-gray-800 border-gray-700"
                }`}
              >
                <div className="flex flex-col space-y-4">
                  <p className="whitespace-pre-wrap break-words">
                    {displayedText}
                  </p>

                  {isLong && (
                    <button
                      onClick={() => toggleExpand(id)}
                      className="self-start text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Show more <MoreHorizontal size={16} />
                        </>
                      )}
                    </button>
                  )}

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => onUpdate(note)}
                      disabled={loading}
                      className="flex items-center gap-2 border border-green-500 px-4 py-1 rounded-2xl hover:bg-green-50 text-green-600 disabled:opacity-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(id)}
                      disabled={loading}
                      className="flex items-center gap-2 border border-red-500 px-4 py-1 rounded-2xl hover:bg-red-50 text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <button
          onClick={handleAddNoteClick}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 rounded-3xl shadow-md transition bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {formOpen ? "Cancel" : "Add Note"}
        </button>
      </div>

      {formOpen && (
        <form ref={formRef} className="mt-6" onSubmit={handleSubmit}>
          <textarea
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
            required
            disabled={loading}
            className="w-full p-4 rounded-3xl border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-8 py-3 rounded-3xl bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-60 transition w-full md:w-auto"
          >
            {editingId ? "Update Note" : "Submit Note"}
          </button>
        </form>
      )}
    </div>
  );
};

export default NotesDisplay;
