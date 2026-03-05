const Notification = require('../models/Notification');

// @desc    Get notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const { unreadOnly } = req.query;
        const query = { recipient: req.user.id };
        if (unreadOnly === 'true') query.read = false;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user.id,
            read: false
        });

        res.status(200).json({
            success: true,
            unreadCount,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user.id  // ensure ownership
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.id
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Helper — create a notification (used internally by other controllers)
 * @param {String} recipientId
 * @param {String} type
 * @param {String} message
 * @param {Object} ref  - optional { refModel, refId }
 */
const createNotification = async (recipientId, type, message, ref = {}) => {
    try {
        await Notification.create({
            recipient: recipientId,
            type,
            message,
            refModel: ref.refModel || null,
            refId: ref.refId || null
        });
    } catch (err) {
        // Non-critical — log but don't break the main flow
        console.error('Failed to create notification:', err.message);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
};
