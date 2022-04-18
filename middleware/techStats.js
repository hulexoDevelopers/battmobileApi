const { jobAssign } = require('./../app/models/jobAssign');
const { User } = require('./../app/models/user');
const express = require('express');

class stats {
    // function to get customer compnay orders
    async getTechJobStats(users) {
        try {
            const stats = [];

            for (let i = 0; i < users.length; i++) {
                let techId = users[i]._id
                let data = {}
                let jobs = (await jobAssign.find({ 'techId': techId }));

                if (jobs.length > 0) {
                    data.totalJobs = jobs.length;
                    data.totalRejected = jobs.filter(data => data.status == 'rejected').length;
                    data.totalCompleted = jobs.filter(data => data.status == 'completed').length;
                } else {
                    data.totalJobs = 0;
                    data.totalRejected = 0;
                    data.totalCompleted = 0;
                }

                data.firstName = users[i].firstName;
                data.lastName = users[i].lastName;
                stats.push(data)
            }
            return stats;


        } catch (error) {
            console.log(error)
            return error
        }
    }




}

module.exports = new stats();