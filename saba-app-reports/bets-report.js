{
    const coll = l1_pro_arc.log_arc.bets_bk;

    const data = coll.aggregate([
        { $match: {
            requestTimeStamp: { $gt: "2023-06-07T" },
            system: 5,
            "call.currency": { $ne: "UUS" },
        } },
        { $project: {
            time: { $substrCP: ["$requestTimeStamp", 0, 10] },
            amount: { $toDouble: "$call.amount" },
        } },
        { $group: {
            _id: { time: "$time", },
            cnt: { $sum: 1 },
            TO: { $sum: "$amount" },
        } },
        { $project: {
            _id: 0,
            time: "$_id.time",
            cnt: 1,
            TO: 1,
        } },
        { $sort: { time: 1 } },

        // { $limit: 10 },
    ]).toArray();

    console.log(data);
    console.log(JSON.stringify(data));
}
