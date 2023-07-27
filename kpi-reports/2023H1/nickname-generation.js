{
    const coll = l1_pro.minigame.userinfos;

    const data = coll.aggregate([
        { $match: {
            type: false,
            currency: { $ne: 'UUS' },
        } },
        { $project: {
            _id: 0,
            name: 1,
            time: { $dateToParts: { date: "$joinedOn" } },
            nameParse: { $regexFind: { input: "$name", regex: /^([A-Za-z]+)[0-9]+$/ } },
        } },
        { $unwind: { path: "$nameParse.captures", preserveNullAndEmptyArrays: true } },
        { $lookup: {
            from: "name_dictionaries",
            localField: "nameParse.captures",
            foreignField: "_id",
            as: "dict",
        } },
        { $unwind: { path: "$dict", preserveNullAndEmptyArrays: true } },
        { $group: {
            _id: { y: "$time.year", m: "$time.month" },
            total: { $sum: 1 },
            input: { $sum: { $cond: [{ $eq: ["$nameParse", null] }, 1, 0] } },
            dict: { $sum: { $cond: [{ $eq: ["$dict", null] }, 0, 1] } },
            others: { $sum: { $cond: [{ $eq: ["$dict", null] }, 1, 0] } },
        } },
        { $set: {
            _id: 0,
            time: { $dateToString: { date: { $dateFromParts: { year: "$_id.y", month: "$_id.m" } } , format: "%Y-%m" } },
        } },
        { $sort: { time: 1 } }
        // { $limit: 100 }
    ]).toArray();

    // JSON.stringify(data);
    console.log(data);
}

{
    const db = l1_pro.minigame;

    const dicts = Object.fromEntries(db.name_dictionaries.find({}).map(_ => [_._id, _.dict]).toArray());
    const keys = db.name_dictionaries.aggregate([{ $group: { _id: "$dict" } }]).map(_ => _._id).toArray();
    const result = {};
    const result2 = {};

    const data = db.userinfos.aggregate([
        { $match: {
            type: false,
            currency: { $ne: 'UUS' },
        } },
        { $project: {
            _id: 0,
            name: 1,
            time: { $dateToParts: { date: "$joinedOn" } },
            nameParse: { $regexFind: { input: "$name", regex: /^([A-Za-z]+)[0-9]+$/ } },
        } },
        { $unwind: { path: "$nameParse.captures", preserveNullAndEmptyArrays: true } },
        { $set: {
            time: { $dateToString: { date: { $dateFromParts: { year: "$time.year", month: "$time.month" } } , format: "%Y-%m" } },
        } },
        // { $limit: 1000 }
    ]).forEach(_ => {
        if (!result[_.time]) {
            result[_.time] = { input: 0, dict: 0, others: 0 }
            result2[_.time] = { input: 0, others: 0 }
            keys.forEach(key => { result2[_.time][key] = 0 });
        }
        if (_.nameParse == null) {
            // _.input = 1;
            result[_.time].input++;
            result2[_.time].input++;
        } else {
            const dict = dicts[_.nameParse.captures];
            if (dict == null) {
                // _.others = 1;
                result[_.time].others++;
                result2[_.time].others++;
            } else {
                // _[dict] = 1;
                result[_.time].dict++;
                result2[_.time][dict]++;
            }
        }

        // delete _.name;
        // delete _.nameParse;
        // return _;
    })//.toArray();

    // JSON.stringify(data);
    // console.log(data);
    // console.log(result);

    console.log(JSON.stringify(Object.entries(result).map(([k,v]) => { v.time = k; return v;})));
    console.log(JSON.stringify(Object.entries(result2).map(([k,v]) => { v.time = k; return v;})));

}
