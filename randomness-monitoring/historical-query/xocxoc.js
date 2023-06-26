{
    const db = l1_pro_arc.minigame_arc;

    const data = db.xocxoc_phiens_bk.aggregate([
        { $project: {
            "_id": 0,
            "time": { $dateToParts: { date: "$time" } },
            "result.red1": { $ifNull: ["$result.red1", "$red1"] },
            "result.red2": { $ifNull: ["$result.red2", "$red2"] },
            "result.red3": { $ifNull: ["$result.red3", "$red3"] },
            "result.red4": { $ifNull: ["$result.red4", "$red4"] },
            "settlementResult": 1,
        } },
        { $set: {
            "time": { $dateFromParts: { year: "$time.year", month: "$time.month", day: "$time.day" } },
            "total": { $add: [
                { $toInt: "$result.red1" },
                { $toInt: "$result.red2" },
                { $toInt: "$result.red3" },
                { $toInt: "$result.red4" }
            ] },
        } },
        { $project: {
            "time": 1,
            "result": 1,
            "settlementResult.odd": { $ifNull: ["$settlementResult.odd", { $eq: [{ $mod: ["$total", 2] }, 1] }] },
            "settlementResult.even": { $ifNull: ["$settlementResult.even", { $eq: [{ $mod: ["$total", 2] }, 0] }] },
            "settlementResult.red2": { $ifNull: ["$settlementResult.red2", { $eq: ["$total", 2] }] },
            "settlementResult.red3": { $ifNull: ["$settlementResult.red3", { $eq: ["$total", 3] }] },
            "settlementResult.red4": { $ifNull: ["$settlementResult.red4", { $eq: ["$total", 4] }] },
            "settlementResult.white3": { $ifNull: ["$settlementResult.white3", { $eq: ["$total", 1] }] },
            "settlementResult.white4": { $ifNull: ["$settlementResult.white4", { $eq: ["$total", 0] }] },
        } },

        { $limit: 100 },
    ]).toArray();

    console.log(data);
}
