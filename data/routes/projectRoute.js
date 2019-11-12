const express = require('express');
const router = express.Router();
const projectDB = require('../helpers/projectModel')

router.get('/', (req, res) => {

  projectDB.get(req.params.id)
    .then( projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      res.status(500).json(err)
    })
    
})

router.get('/:id',validateID, (req, res) => {

  const projects = req.projects

  if (projects) {
    res.status(200).json(projects)
  } else {
    res.status(500).json({message: 'Failed to retrieve the project.'})
  }
})

router.post('/', validateProject, (req, res) => {
  const project = req.body
  
  projectDB.insert(project)
    .then(proj => {
      res.status(201).json(project)
    })
    .catch( err => {
      res.status(500).json({message: 'Failed to add project.'})
    })
})

router.delete('/:id', validateID, (req, res) => {

  projectDB.remove(req.id)
    .then( proj => {
      res.status(200).json({message: 'Delete successful'})
    })
    .catch( err => {
      res.status(500).json({message: 'Failed to delete project'})
    })
})

router.put('/:id', validateID, validateProject, (req, res) => {

  projectDB.update(req.id, req.body)
    .then(updates => {
      res.status(204).json({message: 'Successfully updated project'})
    })
    .catch( err => {
      res.status(500).json({message: 'Failed to update project'})
    })
})

router.get('/:id/actions', validateID, (req, res) => {

  projectDB.getProjectActions(req.id)
    .then( actions => {
      res.status(200).json(actions)
    })
    .catch( err => {
      res.status(500).json({message: 'Could not retrieve actions'})
    })
})

function validateID(req, res, next) {
  const {id} = req.params;

  projectDB.get(id)
    .then(proj => {
      if (proj) {
        req.projects = proj;
        req.id = id
        next();
      } else {
        res.status(400).json({message: "Please provide a valid ID"})
      }
    })
}

function validateProject(req, res, next) {
  if (req.body) {
    if(req.body.description) {
      req.body.name ? next() : res.status(400).json({message: 'Missing required project name'})
    } else {
      res.status(400).json({message: 'Missing required project description'})
    }
  } else {
    res.status(400).json({message: 'Missing project data'})
  }
}


module.exports = router;