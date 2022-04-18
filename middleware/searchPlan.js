const _ = require('lodash');
var moment = require('moment');
const { Plan } = require('../app/models/plan');
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
class searchPlans {
    // function to update total price
    async getFilterPlans(location, categoryId, type) {
        try {
            // console.log('query' + JSON.stringify(query))
            var queryCond = {}

            if (location && location.toString() != 'undefined') {
                queryCond.location = location;
            }
            if (categoryId && categoryId.toString() != 'undefined') {
                queryCond.category = categoryId;
            }
            if (type && type.toString() != 'undefined' && type.toString() != 'null') {
                queryCond.types = { $all: [type] };
            }

            console.log('q cond', JSON.stringify(queryCond))
            let plans = await Plan.find(queryCond);
            return plans;
            console.log('plans' + plans.length)

            // let allPlans = await Plan.find({ isDeleted: false })
            // let filterPlans = allPlans;
            // if (location) {
            //     let data = allPlans.filter(data => data.location == location);
            //     filterPlans = data;
            // }
            // let totalCost = 0;
            // let item = await OrderItems.findOne({ _id: itemId })
            // for (let i = 0; i < item.readiness.length; i++) {
            //     totalCost += item.readiness[i].cost
            // }
            // await item.updateOne(
            //     {
            //         $set: {
            //             "totalCost": totalCost,
            //         }
            //     });


        } catch (error) {
            //console.log(error)
            return error
        }
    }



    async mapObjectIds(ids) {
        try {
            // console.log('ids in md' + ids)
        //    let dataids =  await ids.map(s => mongoose.Types.ObjectId(s))

        //    console.log('dataids' + JSON.stringify(dataids))
            for (let i = 0; i < ids.length; i++) {
                console.log('ids' + ids[i]);
                console.log('oids= ' + ObjectId(ids[i]))
            }


        } catch (error) {
            //console.log(error)
            return error
        }
    }

}

module.exports = new searchPlans();