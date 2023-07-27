{
    console.log(l2_pro_arc.summary_arc.exchange_rates.deleteMany({}));
    console.log(l3_pro_arc.summary_arc.exchange_rates.deleteMany({}));

    const data = l2_pro.minigame.exchange_rates.aggregate([
        { $sort: { exId: -1 } },
        { $limit: 1 },
        { $project: { _id: 0, code: { $objectToArray: "$code" } } },
        { $unwind: "$code" },
        { $project: { code: "$code.k", rate: "$code.v" } },
        { $lookup: {
            from: "currencies",
            localField: "code",
            foreignField: "code",
            as: "cur",
        } },
        { $unwind: "$cur" },
        { $match: { "cur.name": { $ne: "UUS" }, "cur.isTest": false, "cur.enabled": true } },
        { $project: {
            name: "$cur.name",
            code: "$code",
            rate: { $toDouble: { $multiply: ["$rate", "$cur.multiplier"] } },
        } },
        { $group: {
            _id: { name: "$name", code: "$code" },
            rate: { $max: "$rate" }
        } },
        { $project: { _id: 0, name: "$_id.name", code: "$_id.code", rate: "$rate" } },
    ]).toArray();

    console.log(l2_pro_arc.summary_arc.exchange_rates.insertMany(data));
    console.log(l3_pro_arc.summary_arc.exchange_rates.insertMany(data));
}
