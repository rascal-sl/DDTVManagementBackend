/**
 * Admin Service: Business logic for admin user management.
 * Handles finding, validating, and deleting admin or super_admin users.
 */

const User = require('../models/user.model');

/**
 * Deletes an admin or super_admin by ID.
 * Throws errors if not found or user is not an admin/super_admin.
 * @param {String} id - User ID to delete
 * @param {String} currentUserId - Requesting user's ID (for self-delete check)
 * @returns {Object} Deleted user document
 */
const deleteAdminById = async (id, currentUserId) => {
    // Prevent super_admin from deleting their own account
    if (id === currentUserId) {
        const err = new Error('You cannot delete your own account.');
        err.statusCode = 400;
        throw err;
    }

    // Find the user by ID and check role
    const user = await User.findById(id);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
        const err = new Error('Admin not found');
        err.statusCode = 404;
        throw err;
    }

    // Delete the user
    await User.findByIdAndDelete(id);
    return user;
};

module.exports = { deleteAdminById };
