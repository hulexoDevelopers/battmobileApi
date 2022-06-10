const express = require('express');
const app = express();
var fs = require('fs');
var router = express.Router();
var cors = require("cors");
const options = {
    key: fs.readFileSync('../../../../etc/letsencrypt/live/batteryreplacementdubai.com/privkey.pem'),
    cert: fs.readFileSync('../../../../etc/letsencrypt/live/batteryreplacementdubai.com/cert.pem'),
    ca: fs.readFileSync('../../etc/letsencrypt/live/batteryreplacementdubai.com/fullchain.pem'),
};
// fill in relevant certificate info here


const serverHttps = require('https').createServer(options, app);
var ios = require('socket.io')(serverHttps, {
    cors: {
        origin: "*",
    },
});

serverHttps.listen(4000,
    {
        origins: '*'
    },
    function () {
        console.log("server running at https://IP_ADDRESS:8000/")
    });


var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});

server.listen(4001, {
    origins: '*'
}, function (req, res) {

});



let users = [];

let technicians = [];

const addUser = (userId, role, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, role, socketId });
    console.log('users ' + JSON.stringify(users))
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};


const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

ios.on("connection", (socket) => {
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
        socket.broadcast.emit('updateActiveJobs', data);
    });


    //new inquiry
    socket.on('newInquiry', function (data) {
        socket.broadcast.emit('newInquiryRcvd', data);
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
        socket.broadcast.emit('updateActiveJobs', data);
    });


    //new inquiry
    socket.on('newInquiry', function (data) {
        socket.broadcast.emit('newInquiryRcvd', data);
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