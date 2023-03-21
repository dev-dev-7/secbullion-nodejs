const express = require('express')
const router = express.Router()
const adminDashboardController = require('../../components/dashboard/admin/dashboardController');

// Auth
router.get('/dashboard', adminDashboardController.get)

module.exports = router
