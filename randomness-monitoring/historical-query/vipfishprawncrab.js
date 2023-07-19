{
    const db = l1_pro_arc.minigame_arc;

    const data = db.vipfishprawncrab_phiens_bk.aggregate([
        { $project: {
            "_id": 0,
            "time": { $dateToParts: { date: "$time" } },
            "result": 1,
            "selltementResult.anyTriple": 1,
            "selltementResult.mountain": 1,
            "selltementResult.ocean": 1,
        } },
        { $set: {
            "time": { $dateFromParts: { year: "$time.year", month: "$time.month", day: "$time.day" } },
        } },

        { $limit: 100 },
    ]).toArray();

    console.log(data);
}
