const Notification = require("../models/notification");

module.exports.getNotifications = async (req, res) => {

    const notifications = await Notification.find({
        recipient: req.user._id
    })
    .populate("sender")
    .populate("listing")
    .sort({ createdAt: -1 });

    res.render("notifications/index", {
        notifications
    });

};

module.exports.markAsRead = async (req, res) => {

    await Notification.findByIdAndUpdate(
        req.params.id,
        {
            isRead: true
        }
    );

    res.redirect("/notifications");

};