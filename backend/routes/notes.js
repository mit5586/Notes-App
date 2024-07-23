const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/getuser')
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');

//Route: 1 Get all the Notes: GET "/api/notes/fetchallnotes".  require login
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user });
        res.json(notes)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error occured", message: error.message })
    }

})

//Route: 2 Add a new Note using: POST "/api/notes/addnote".  require login
router.post('/addnote', fetchUser, [
    body('title', 'title must be atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

    //if there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body
        const note = new Notes({
            title, description, tag, user: req.user
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error occured", message: error.message })
    }
})

//Route: 3 update a Note using: PUT "/api/notes/updatenote".  require login
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        //create a new note obj
        const newNote = {}
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to update and update it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("not found") }

        if (note.user.toString() !== req.user) {
            return res.status(401).send("not allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error occured", message: error.message })
    }
})

//Route: 4 Delete a Note using: DELETE "/api/notes/deletenote".  require login
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        //find the note to update and update it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("not found") }

        if (note.user.toString() !== req.user) {
            return res.status(401).send("not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({seccess: 'note has been deleated', note: note})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error occured", message: error.message })
    }
})



module.exports = router