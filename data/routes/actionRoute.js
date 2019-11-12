const express = require('express');
const router = express.Router();
const actionDB = require('../helpers/actionModel');
const projectDB = require('../helpers/projectModel')

router.get('/', (req, res) => {
  
  actionDB.get()
    .then( actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      res.status(500).json({message: 'Actions could not be retrieved.'})
    })
})

router.get('/:id', validateActionID, (req, res) => {
  const id = req.params.id;

  actionDB.get(id)
    .then(actions => {
      res.status(200).json({actions})
    })
    .catch( err => {
      res.status(500).json({err: err})
    })
})

router.post('/', validateAction, validateProjectID, (req, res) => {

  actionDB.insert(req.body)
    .then( action => res.status(200).json({message: 'Action added!'})
    .catch( err => res.status(500).json({message: 'Could not add action to database'}))
)})

router.put('/:id', validateActionID, validateAction, (req, res) => {
  const {id} = req.params

  actionDB.update(id, req.body)
    .then (action => res.status(200).json({message: 'Successfully updated action!'}))
    .catch( err => res.status(500).json({message: 'Could not update action!'}))
})

router.delete('/:id', validateActionID, (req, res) => {
  const {id} = req.params

  actionDB.remove(id)
    .then( () => res.status(200).json({message: 'Action successfully deleted!'}))
    .catch( err => res.status(500).json({err: err}))
})


function validateProjectID(req, res, next) {
  const id = req.body.project_id;
  if (typeof id === 'undefined'){
    res.status(400).json({message: 'You must provide a project_id in the request body'})
  }

  projectDB.get(id)
    .then(proj => {
      if (proj) {
        next();
      } else {
        res.status(400).json({message: "Please provide a valid ID"})
      }
    })
}

function validateActionID(req, res, next) {
  const {id} = req.params

  actionDB.get(id)
    .then(action => {
      if (action) {
        next()
      } else {
        res.status(400).json({message: "Please provide a valid ID"})
      }
    })
}

function validateAction(req, res, next) {
  if (req.body) {
    if(req.body.description) {
      req.body.notes ? next() : res.status(400).json({message: 'Missing required action notes'})
    } else {
      res.status(400).json({message: 'Missing required action description'})
    }
  } else {
    res.status(400).json({message: 'Missing action data'})
  }
}

module.exports = router