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
const advancedResults = require('../middleware/advancedResults');
const Project = require('../models/Project');

router
  .route('/')
  .get(advancedResults(Project, 'developer'), getProjects)
  .post(
    protect, 
    authorize('developer', 'admin'), 
    upload.fields([
      { name: 'images', maxCount: 10 },
      { name: 'floorPlans', maxCount: 5 },
      { name: 'brochures', maxCount: 3 },
      { name: 'virtualTours', maxCount: 2 }
    ]),
    createProject
  );

// My projects route for developer users
router
  .route('/my-projects')
  .get(protect, authorize('developer'), getMyProjects);

// Projects by developer route
router
  .route('/developer/:developerId')
  .get(getProjectsByDeveloper);

router
  .route('/:id')
  .get(getProject)
  .put(
    protect, 
    authorize('developer', 'admin'),
    upload.fields([
      { name: 'images', maxCount: 10 },
      { name: 'floorPlans', maxCount: 5 },
      { name: 'brochures', maxCount: 3 },
      { name: 'virtualTours', maxCount: 2 }
    ]),
    updateProject
  )
  .delete(protect, authorize('developer', 'admin'), deleteProject);

module.exports = router;
