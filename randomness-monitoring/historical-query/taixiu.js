{
    const db = l1_pro_arc.minigame_arc;

    const data = db.taixiu_phiens_bk.aggregate([
        { $project: {
            "_id": 0,
            "time": { $dateToParts: { date: "$time" } },
            "result.dice1": { $ifNull: ["$result.dice1", "$dice1"] },
            "result.dice2": { $ifNull: ["$result.dice2", "$dice2"] },
            "result.dice3": { $ifNull: ["$result.dice3", "$dice3"] },
            "settlementResult": 1,
        } },
        { $set: {
            "time": { $dateFromParts: { year: "$time.year", month: "$time.month", day: "$time.day" } },
            "total": { $add: [
                "$result.dice1",
                "$result.dice2",
                "$result.dice3",
            ] },
        } },
        { $project: {
            "time": 1,
            "result": 1,
            "settlementResult.big": { $ifNull: ["$settlementResult.big", { $gte: ["$total", 11] }] },
            "settlementResult.small": { $ifNull: ["$settlementResult.small", { $lte: ["$total", 10] }] },
        } },

        { $limit: 100 },
    ]).toArray();

    console.log(data);
}
