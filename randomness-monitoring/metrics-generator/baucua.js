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
        { $group: {
            _id: "$time",
            "dice1_0": { $sum: { $cond: [{ $eq: ["$result.dice1", 0] }, 1, 0] } },
            "dice1_1": { $sum: { $cond: [{ $eq: ["$result.dice1", 1] }, 1, 0] } },
            "dice1_2": { $sum: { $cond: [{ $eq: ["$result.dice1", 2] }, 1, 0] } },
            "dice1_3": { $sum: { $cond: [{ $eq: ["$result.dice1", 3] }, 1, 0] } },
            "dice1_4": { $sum: { $cond: [{ $eq: ["$result.dice1", 4] }, 1, 0] } },
            "dice1_5": { $sum: { $cond: [{ $eq: ["$result.dice1", 5] }, 1, 0] } },

            "dice2_0": { $sum: { $cond: [{ $eq: ["$result.dice2", 0] }, 1, 0] } },
            "dice2_1": { $sum: { $cond: [{ $eq: ["$result.dice2", 1] }, 1, 0] } },
            "dice2_2": { $sum: { $cond: [{ $eq: ["$result.dice2", 2] }, 1, 0] } },
            "dice2_3": { $sum: { $cond: [{ $eq: ["$result.dice2", 3] }, 1, 0] } },
            "dice2_4": { $sum: { $cond: [{ $eq: ["$result.dice2", 4] }, 1, 0] } },
            "dice2_5": { $sum: { $cond: [{ $eq: ["$result.dice2", 5] }, 1, 0] } },

            "dice3_0": { $sum: { $cond: [{ $eq: ["$result.dice3", 0] }, 1, 0] } },
            "dice3_1": { $sum: { $cond: [{ $eq: ["$result.dice3", 1] }, 1, 0] } },
            "dice3_2": { $sum: { $cond: [{ $eq: ["$result.dice3", 2] }, 1, 0] } },
            "dice3_3": { $sum: { $cond: [{ $eq: ["$result.dice3", 3] }, 1, 0] } },
            "dice3_4": { $sum: { $cond: [{ $eq: ["$result.dice3", 4] }, 1, 0] } },
            "dice3_5": { $sum: { $cond: [{ $eq: ["$result.dice3", 5] }, 1, 0] } },
        } },
        { $project: {
            _id: 0,
            time: "$_id",
            metrics: [
                { metadata: { actor: "dice1" }, metric: "rand_0", type: "counter", value: "$dice1_0" },
                { metadata: { actor: "dice1" }, metric: "rand_1", type: "counter", value: "$dice1_1" },
                { metadata: { actor: "dice1" }, metric: "rand_2", type: "counter", value: "$dice1_2" },
                { metadata: { actor: "dice1" }, metric: "rand_3", type: "counter", value: "$dice1_3" },
                { metadata: { actor: "dice1" }, metric: "rand_4", type: "counter", value: "$dice1_4" },
                { metadata: { actor: "dice1" }, metric: "rand_5", type: "counter", value: "$dice1_5" },

                { metadata: { actor: "dice2" }, metric: "rand_0", type: "counter", value: "$dice2_0" },
                { metadata: { actor: "dice2" }, metric: "rand_1", type: "counter", value: "$dice2_1" },
                { metadata: { actor: "dice2" }, metric: "rand_2", type: "counter", value: "$dice2_2" },
                { metadata: { actor: "dice2" }, metric: "rand_3", type: "counter", value: "$dice2_3" },
                { metadata: { actor: "dice2" }, metric: "rand_4", type: "counter", value: "$dice2_4" },
                { metadata: { actor: "dice2" }, metric: "rand_5", type: "counter", value: "$dice2_5" },

                { metadata: { actor: "dice3" }, metric: "rand_0", type: "counter", value: "$dice3_0" },
                { metadata: { actor: "dice3" }, metric: "rand_1", type: "counter", value: "$dice3_1" },
                { metadata: { actor: "dice3" }, metric: "rand_2", type: "counter", value: "$dice3_2" },
                { metadata: { actor: "dice3" }, metric: "rand_3", type: "counter", value: "$dice3_3" },
                { metadata: { actor: "dice3" }, metric: "rand_4", type: "counter", value: "$dice3_4" },
                { metadata: { actor: "dice3" }, metric: "rand_5", type: "counter", value: "$dice3_5" },
            ],
        } },
        { $unwind: "$metrics" },
        { $set: {
            time: "$$REMOVE",
            "metrics.time": "$time",
        } },
        { $replaceWith: "$metrics" },
    ]).toArray();

    console.log(data);
}
