{
  const coll = l1_pro_arc.summary_arc.daily_summaries;

  const data = coll.aggregate([
    { $match: {
        time: { $gte: ISODate("2022-06-01") },
        currency: { $nin: ["UUS"] },
    } },
    { $set: {
        _id: "$$REMOVE",
        time: { $dateToParts: { date: "$time" } },
    } },
    { $group: {
        _id: { y: "$time.year", m: "$time.month", gameId: "$gameId" },
        TO: { $sum: "$stake" },
        PO: { $sum: "$payout" },
    } },
    { $set: {
        _id: "$$REMOVE",
        month: { $dateToString: { date: { $dateFromParts: { year: "$_id.y", month: "$_id.m" } }, format: "%Y-%m" } },
        gameId: "$_id.gameId",
        GGR: { $round: [{ $subtract: ["$TO", "$PO"] }, 2] },
    } },
    { $sort: { month: 1, gameId: 1 } },
  ]).toArray();

  console.log(JSON.stringify(data));
}

{
  const coll = l2_pro_arc.summary_arc.daily_summaries;

  const data = coll.aggregate([
    { $match: {
        time: { $gte: ISODate("2022-06-01") },
        currency: "INH",
        partnerId: { $in: ["ONEworks1", "ONEworksVGCash"] }
    } },
    { $set: {
        _id: "$$REMOVE",
        time: { $dateToParts: { date: "$time" } },
    } },
    { $group: {
        _id: { y: "$time.year", m: "$time.month", gameId: "$gameId" },
        TO: { $sum: "$stake" },
        PO: { $sum: "$payout" },
    } },
    { $set: {
        _id: "$$REMOVE",
        month: { $dateToString: { date: { $dateFromParts: { year: "$_id.y", month: "$_id.m" } }, format: "%Y-%m" } },
        gameId: "$_id.gameId",
        GGR: { $round: [{ $subtract: ["$TO", "$PO"] }, 2] },
    } },
    { $sort: { month: 1, gameId: 1 } },
  ]).toArray();

  console.log(JSON.stringify(data));
}

{
  const coll2 = l2_pro_arc.summary_arc.daily_summaries;
  const coll3 = l3_pro_arc.summary_arc.daily_summaries;

  const data2 = coll2.aggregate([
    { $match: {
        time: { $gte: ISODate("2022-06-01") },
        $or: [
          { currency: "INH",
            partnerId: { $nin: ["ONEworks1", "ONEworksVGCash"] }
          },
          { currency: { $nin: ["INH", "UUS"] } },
        ],
    } },
    { $lookup: {
      from: "exchange_rates",
      localField: "currency",
      foreignField: "name",
      as: "ex",
    } },
    { $unwind: "$ex" },
    { $set: {
        _id: "$$REMOVE",
        ex: "$$REMOVE",
        time: { $dateToParts: { date: "$time" } },
        stake: { $multiply: ["$stake", "$ex.rate"] },
        payout: { $multiply: ["$payout", "$ex.rate"] },
    } },
    { $group: {
        _id: { y: "$time.year", m: "$time.month", gameId: "$gameId" },
        TO: { $sum: "$stake" },
        PO: { $sum: "$payout" },
    } },
    { $set: {
        _id: "$$REMOVE",
        month: { $dateToString: { date: { $dateFromParts: { year: "$_id.y", month: "$_id.m" } }, format: "%Y-%m" } },
        gameId: "$_id.gameId",
        GGR: { $round: [{ $subtract: ["$TO", "$PO"] }, 2] },
    } },
    { $sort: { month: 1, gameId: 1 } },
  ]).toArray();

  const data3 = coll3.aggregate([
    { $match: {
        time: { $gte: ISODate("2022-06-01") },
        currency: { $nin: ["UUS"] },
    } },
    { $lookup: {
      from: "exchange_rates",
      localField: "currency",
      foreignField: "name",
      as: "ex",
    } },
    { $unwind: "$ex" },
    { $set: {
        _id: "$$REMOVE",
        ex: "$$REMOVE",
        time: { $dateToParts: { date: "$time" } },
        stake: { $multiply: ["$stake", "$ex.rate"] },
        payout: { $multiply: ["$payout", "$ex.rate"] },
    } },
    { $group: {
        _id: { y: "$time.year", m: "$time.month", gameId: "$gameId" },
        TO: { $sum: "$stake" },
        PO: { $sum: "$payout" },
    } },
    { $set: {
        _id: "$$REMOVE",
        month: { $dateToString: { date: { $dateFromParts: { year: "$_id.y", month: "$_id.m" } }, format: "%Y-%m" } },
        gameId: "$_id.gameId",
        GGR: { $round: [{ $subtract: ["$TO", "$PO"] }, 2] },
    } },
    { $sort: { month: 1, gameId: 1 } },
  ]).toArray();

  console.log(JSON.stringify(data2.concat(data3)));
}
