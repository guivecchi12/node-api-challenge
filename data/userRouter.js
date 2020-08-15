const express = require('express');
const project = require('./helpers/projectModel');
const action = require('./helpers/actionModel');
const router = express.Router();

//Project functions

router.get('/project/:id', validateProjectId(), (req, res) => {
   res.status(200).json(req.project)
})

router.post('/project', (req, res) => {

    const body = req.body
    if(body){
        project.insert(body)
        .then((post) => {
            if(post){
            res.status(201).json(post)
            }
            else{
            res.status(400).json({message: "Project broke"})
            }
        })
        .catch((err) => {
            next(err)
        })
    }
});

router.put('/project/:id', validateProjectId() ,validateChange(), (req,res) => {
    const id = req.params.id;
    const changes = req.body;
    project.update(id, changes)
    .then((change) => {
        if(change){
            res.status(200).json({message: "Project modified"})
        }
        else{
            res.status(400).json({ message: "error while making changes" })
        }
    })
    .catch((err) => next(err))
})

router.delete('/project/:id', validateProjectId(), (req, res) => {
    project.remove(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "This project is no more"
      })
    })
    .catch((err) => {next(err)})
})

// action functions

router.get('/action/:id', validateActions(), (req, res) => {
    res.status(200).json(req.action)
 })

router.post('/action/:id',  validateProjectId(), validateNewAction(), (req, res) => {

    const body = {
        project_id: req.params.id, 
        description: req.body.description,
        notes: req.body.notes
     }

    if(body){
        action.insert(body)
        .then((act) => {
            if(act){
            res.status(201).json(act)
            }
            else{
            res.status(400).json({message: "Action broke"})
            }
        })
        .catch((err) => {
            next(err)
        })
    }
});

router.put('/action/:id', validateActions() ,validateActionChange(), (req,res) => {
    const id = req.params.id;
    const changes = req.body;
    action.update(id, changes)
    .then((change) => {
        if(change){
            res.status(200).json({message: "Action modified"})
        }
        else{
            res.status(400).json({ message: "error while making changes" })
        }
    })
    .catch((err) => next(err))
})

router.delete('/action/:id', validateActions(), (req, res) => {
    action.remove(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "This action is no more"
      })
    })
    .catch((err) => {next(err)})
})

//middleware for Projects

function validateProjectId() {
    return(req, res, next) => {
      project.get(req.params.id)
          .then((proj) => {
            if(proj){
                req.project = proj
                next()
            }
            else{
                res.status(400).json({
                    message: "invalid user id"
                })
            }
        })
        .catch((err) => {
            next(err)
        })
    }
}
function validateChange() {
    return(req, res, next) => {
        const proj = req.body;
        if(Object.keys(proj).length === 0){
            res.status(400).json({ message: "missing post data" })
        }
        else if (!proj.name && !proj.description){
            res.status(400).json({
            message: "Need to change either name or description of project"
            })
        }
        next()
    }
}

// middleware for Actions

function validateActions() {
    return(req, res, next) => {
      project.getProjectActions(req.params.id)
          .then((act) => {
            if(act){
                req.action = act
                next()
            }
            else{
                res.status(400).json({
                    message: "invalid action ID"
                })
            }
        })
        .catch((err) => {
            next(err)
        })
    }
}
function validateNewAction() {
    return(req, res, next) => {
        const act = req.body;
        if(Object.keys(act).length === 0){
            res.status(400).json({ message: "missing post data" })
        }
        else if (!act.description || !act.notes){
            res.status(400).json({
            message: "Missing either description or notes"
            })
        }
        next()
    }
}
function validateActionChange() {
    return(req, res, next) => {
        const act = req.body;
        if(Object.keys(act).length === 0){
            res.status(400).json({ message: "missing action data" })
        }
        else if (!act.description && !act.notes){
            res.status(400).json({
            message: "Missing either description or notes changes"
            })
        }
        next()
    }
}

module.exports = router;