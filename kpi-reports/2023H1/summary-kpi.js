{
    const coll = l1_pro_arc.summary_arc.daily_summaries;

    const data = coll.aggregate([
    // coll.aggregate([
        { $match: {
            time: { $gte: ISODate("2022-10-01") },
            currency: { $nin: ["UUS"] },
        } },
        { $project: {
            _id: 0,
            time: { $dateToParts: { date: "$time" } },
            playerIds: 1,
        } },
        { $unwind: "$playerIds" },
        { $group: {
            _id: { y: "$time.year", m: "$time.month" },
            playerIds: { $addToSet: "$playerIds" },
        } },
        { $set: {
            _id: "$$REMOVE",
            month: { $dateToString: { date: { $dateFromParts: { year: "$_id.y", month: "$_id.m" } }, format: "%Y-%m" } },
        } },
        { $sort: { month: 1 } },
    // ])
    ]).map(_ => {
        _.playerIdsSet = new Set(_.playerIds);
        return _;
    }).toArray();

    const report = [];
    data.forEach((ele, idx, arr) => {
        if (idx === arr.length || idx === 0) {
            return;
        }

        const result = {};
        const { month, playerIdsSet } = ele;
        const { playerIds: prevPlayerIds } = arr[idx - 1];

        result.month = month;

        const lostPlayers = prevPlayerIds.filter(_ => !playerIdsSet.has(_));
        result.lostPlayers = lostPlayers.length;
        result.startOfMonthPlayers = prevPlayerIds.length;
        result.churnRate = lostPlayers.length / prevPlayerIds.length;

        report.push(result);
    });

    console.log(report);
}
