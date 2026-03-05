const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [
            'APPLICATION_RECEIVED',   // employer receives when someone applies
            'APPLICATION_STATUS',     // job seeker receives when status changes
            'JOB_SAVED',              // job seeker saves a job
            'GENERAL'
        ],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    // Optional reference to the related document
    refModel: {
        type: String,
        enum: ['Application', 'Job', null],
        default: null
    },
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for fast querying
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
