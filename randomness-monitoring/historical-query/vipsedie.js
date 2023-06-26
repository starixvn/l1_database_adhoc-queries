{
    const db = l1_pro_arc.minigame_arc;

    const data = db.vipsedie_phiens_bk.aggregate([
        { $project: {
            "_id": 0,
            "time": { $dateToParts: { date: "$time" } },
            "result": 1,
            "settlementResult": 1,
        } },
        { $set: {
            "time": { $dateFromParts: { year: "$time.year", month: "$time.month", day: "$time.day" } },
        } },

        { $limit: 100 },
    ]).toArray();

    console.log(data);
}
