local.forEach(dbs => {
    // const dbs = l1;

    const data = dbs.minigame_arc.xocxoc_phiens_bk.aggregate([
        { $project: {
            "_id": 0,
            "id": 1,
            "result.red1": { $ifNull: ["$result.red1", "$red1"] },
            "result.red2": { $ifNull: ["$result.red2", "$red2"] },
            "result.red3": { $ifNull: ["$result.red3", "$red3"] },
            "result.red4": { $ifNull: ["$result.red4", "$red4"] },
            "settlementResult": 1,
        } },
        { $set: {
            "total": { $add: [ { $toInt: "$result.red1" }, { $toInt: "$result.red2" }, { $toInt: "$result.red3" }, { $toInt: "$result.red4" }] },
        } },
        { $set: {
            "total": "$$REMOVE",
            "settlementResult.odd": { $ifNull: ["$settlementResult.odd", { $eq: [{ $mod: ["$total", 2] }, 1] }] },
            "settlementResult.even": { $ifNull: ["$settlementResult.even", { $eq: [{ $mod: ["$total", 2] }, 0] }] },
            "settlementResult.red2": { $ifNull: ["$settlementResult.red2", { $eq: ["$total", 2] }] },
            "settlementResult.red3": { $ifNull: ["$settlementResult.red3", { $eq: ["$total", 3] }] },
            "settlementResult.red4": { $ifNull: ["$settlementResult.red4", { $eq: ["$total", 4] }] },
            "settlementResult.white3": { $ifNull: ["$settlementResult.white3", { $eq: ["$total", 1] }] },
            "settlementResult.white4": { $ifNull: ["$settlementResult.white4", { $eq: ["$total", 0] }] },
        } },
        { $group: {
            _id: "",
            "lastRound": { $max: "$id" },

            "coin1_red": { $sum: { $cond: ["$result.red1", 1, 0] } },
            "coin1_white": { $sum: { $cond: ["$result.red1", 0, 1] } },

            "coin2_red": { $sum: { $cond: ["$result.red2", 1, 0] } },
            "coin2_white": { $sum: { $cond: ["$result.red2", 0, 1] } },

            "coin3_red": { $sum: { $cond: ["$result.red3", 1, 0] } },
            "coin3_white": { $sum: { $cond: ["$result.red3", 0, 1] } },

            "coin4_red": { $sum: { $cond: ["$result.red4", 1, 0] } },
            "coin4_white": { $sum: { $cond: ["$result.red4", 0, 1] } },

            "odd": { $sum: { $toInt: "$settlementResult.odd" } },
            "even": { $sum: { $toInt: "$settlementResult.even" } },

            "0red": { $sum: { $toInt: "$settlementResult.white4" } },
            "1red": { $sum: { $toInt: "$settlementResult.white3" } },
            "2red": { $sum: { $toInt: "$settlementResult.red2" } },
            "3red": { $sum: { $toInt: "$settlementResult.red3" } },
            "4red": { $sum: { $toInt: "$settlementResult.red4" } },
        } },
        { $project: {
            _id: 0,
            metrics: [
                { metadata: {}, metric: "lastRound", type: "gauge", value: "$lastRound" },

                { metadata: { actor: "coin1" }, metric: "rand_red", type: "counter", value: "$coin1_red" },
                { metadata: { actor: "coin1" }, metric: "rand_white", type: "counter", value: "$coin1_white" },

                { metadata: { actor: "coin2" }, metric: "rand_red", type: "counter", value: "$coin2_red" },
                { metadata: { actor: "coin2" }, metric: "rand_white", type: "counter", value: "$coin2_white" },

                { metadata: { actor: "coin3" }, metric: "rand_red", type: "counter", value: "$coin3_red" },
                { metadata: { actor: "coin3" }, metric: "rand_white", type: "counter", value: "$coin3_white" },

                { metadata: { actor: "coin4" }, metric: "rand_red", type: "counter", value: "$coin4_red" },
                { metadata: { actor: "coin4" }, metric: "rand_white", type: "counter", value: "$coin4_white" },

                { metadata: {}, metric: "settle_odd", type: "counter", value: "$odd" },
                { metadata: {}, metric: "settle_even", type: "counter", value: "$even" },

                { metadata: {}, metric: "settle_0red", type: "counter", value: "$0red" },
                { metadata: {}, metric: "settle_1red", type: "counter", value: "$1red" },
                { metadata: {}, metric: "settle_2red", type: "counter", value: "$2red" },
                { metadata: {}, metric: "settle_3red", type: "counter", value: "$3red" },
                { metadata: {}, metric: "settle_4red", type: "counter", value: "$4red" },
            ],
        } },
        { $unwind: "$metrics" },
        { $replaceWith: "$metrics" },
        { $merge: {
            into: { db: "minigame", coll: "xocxoc_metrics" },
            on: ["metric", "metadata"],
        } },
    ]);

    console.log(dbs);
    console.table(dbs.minigame.xocxoc_metrics.find({}, { _id: 0 }).toArray());
})
