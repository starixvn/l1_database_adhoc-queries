{
    const db = l1_pro_arc.minigame_arc;

    const data = db.baucua_phiens_bk.aggregate([
        { $project: {
            "_id": 0,
            "time": { $dateToParts: { date: "$time" } },
            "result.dice1": { $ifNull: ["$result.dice1", "$dice1"] },
            "result.dice2": { $ifNull: ["$result.dice2", "$dice2"] },
            "result.dice3": { $ifNull: ["$result.dice3", "$dice3"] },
        } },
        { $set: {
            "time": { $dateFromParts: { year: "$time.year", month: "$time.month", day: "$time.day" } },
        } },

        { $limit: 100 },
    ]).toArray();

    console.log(data);
}
