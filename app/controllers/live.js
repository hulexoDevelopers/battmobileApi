var express = require('express');
var router = express.Router();
var app = express();
const smsManager = require('../../middleware/sms');
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});
var cors = require("cors");
server.listen(4000, {
    origins: '*'
}, function (req, res) {

});

let users = [];

let technicians = [];

const addUser = (userId, role, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, role, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};


const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //add new user
    socket.on("addUser", (user) => {
        addUser(user.userId, user.role, socket.id);
        io.emit("getUsers", users);
    });


    //assign jobs
    socket.on('assignJob', function (data) {
        socket.broadcast.emit('updateJobs', data);
    });


    //active jobs
    socket.on('activateJob', function (data) {
        smsManager.jobConfirmation(data.techContact)
        socket.broadcast.emit('updateActiveJobs', data);
    });


    //new inquiry
    socket.on('newInquiry', function (data) {
        socket.broadcast.emit('newInquiryRcvd', data);
    });

    //location update
    socket.on('locatoinUpdate', function (data) {
        socket.broadcast.emit('locationUpdated', data);
    });

    //new inquiry
    socket.on('newInquiryNotification', function (data) {
        socket.broadcast.emit('newInquiryNotification', data);
    });

    //reject job
    socket.on('rejectJobNotification', function (data) {
        socket.broadcast.emit('rejectJobNotification', data);
    });


    //assign jobs
    socket.on('updateJob', function (data) {
        socket.broadcast.emit('refreshJobs', data);
    });


    //admin notitfications
    socket.on('newNotification', function (data) {
        socket.broadcast.emit('refreshhh', data);
    });


    socket.on('requetLocation', function (data) {
        // sending to sender-client only
        socket.broadcast.emit('updateLocation', data);
    });

    socket.on('postComment', function (data) {
        socket.broadcast.emit('getPostComment', data);
    });



    socket.on('pushNotification', function (data) {
        socket.broadcast.emit('getNotification', data);
    });

    socket.on('postComment', function (data) {
        socket.broadcast.emit('getPostComment', data);
    });



    socket.on('sendMessage', function (data) {

        const user = getUser(data.receiverId);
        if (user) {
            socket.broadcast.to(user.socketId).emit("getMessage", data);
            // io.to(user.socketId).emit("getMessage", data);
        }
        // io.emit('getMessage', "this is a test");
        //  socket.broadcast.emit('getPostComment', data);
        // socket.broadcast.emit('getPostComment', data);
    });


    socket.on('checkOnline', function (data) {

        const user = getUser(data.friendId);
        if (user) {
            socket.broadcast.to(user.socketId).emit("getMessage", data);
        }
    });






    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});



module.exports = router;