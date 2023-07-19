{
    const coll = l1_pro_arc.minigame_arc.treasureisland_rounds_bk;

    const res = coll.aggregate([
        { $group: {
            _id: {
                stake: { $multiply: ['$totalAmount', { $toInt: { $not: '$freeSpin' } }] },
                multiplier: '$totalMultiplier',
            },
            tickets: { $sum: 1 },
            PO: { $sum: '$betwin' },
        } },
        { $project: {
            _id: 0,
            stake: '$_id.stake',
            multiplier: '$_id.multiplier',
            tickets: 1,
            TO: { $multiply: ['$_id.stake', '$tickets'] },
            PO: 1,
        } },
        { $sort: { stake: 1, multiplier: 1 } },
    ]).toArray();

    console.log(JSON.stringify(res));
}

{
    const coll = l1_pro_arc.minigame_arc.treasureisland_rounds_bk;

    const res = coll.aggregate([
        { $match: { currency: { $nin: ['UUS'] } } },
        { $group: {
            _id: {
                coin: '$coinValue',
                level: '$betLevel',
                multiplier: '$betMultiplier',
            },
            tickets: { $sum: 1 },
            PO: { $sum: '$betwin' },
            TO: { $sum: { $multiply: ['$totalAmount', { $toInt: { $not: '$freeSpin' } }] } },
        } },
        { $project: {
            _id: 0,
            coin: '$_id.coin',
            level: '$_id.level',
            multiplier: '$_id.multiplier',
            tickets: 1,
            PO: { $round: ['$PO', 2] },
            TO: { $round: ['$TO', 2] },
            RTP: { $round: [{ $divide: ['$PO', '$TO'] }, 4] },
        } },
        { $sort: { 'coin': 1, 'level': 1 } },
    ]).toArray();

    console.log(JSON.stringify(res));
}
