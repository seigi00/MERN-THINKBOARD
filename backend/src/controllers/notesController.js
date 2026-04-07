import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch notes", error: error.message });
    }
}

export async function createNote(req, res) {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const createdNote = await Note.create({ title, description });
        res.status(201).json(createdNote);
    } catch (error) {
        res.status(500).json({ message: "Failed to create note", error: error.message });
    }
}

export async function updateNote(req, res) {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: "Failed to update note", error: error.message });
    }
}

export async function deleteNote(req, res) {
    try {
        const { id } = req.params;
        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete note", error: error.message });
    }
}
