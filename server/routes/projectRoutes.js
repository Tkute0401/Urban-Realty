const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProjects,
  getProject,
  getProjectsByDeveloper,
  getMyProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const upload = require('../middleware/multer');
const parseFormData = require('../middleware/parseFormData');
const advancedResults = require('../middleware/advancedResults');
const Project = require('../models/Project');

router
  .route('/')
  .get(advancedResults(Project, 'developers'), getProjects)
  .post(
    protect, 
    authorize('developer', 'agent', 'admin'), 
    upload.fields([
      { name: 'images', maxCount: 10 },
      { name: 'floorPlans', maxCount: 5 },
      { name: 'brochures', maxCount: 3 },
      { name: 'virtualTours', maxCount: 2 }
    ]),
    parseFormData,
    createProject
  );

// My projects route for developer and agent users
router
  .route('/my-projects')
  .get(protect, authorize('developer', 'agent'), getMyProjects);

// Projects by developer route
router
  .route('/developer/:developerId')
  .get(getProjectsByDeveloper);

router
  .route('/:id')
  .get(getProject)
  .put(
    protect, 
    authorize('developer', 'agent', 'admin'),
    upload.fields([
      { name: 'images', maxCount: 10 },
      { name: 'floorPlans', maxCount: 5 },
      { name: 'brochures', maxCount: 3 },
      { name: 'virtualTours', maxCount: 2 }
    ]),
    parseFormData,
    updateProject
  )
  .delete(protect, authorize('developer', 'agent', 'admin'), deleteProject);

module.exports = router;
