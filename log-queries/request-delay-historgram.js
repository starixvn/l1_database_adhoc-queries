{
    const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})[.]?(\d*)[+]\d{2}:\d{2}$/;
    l1_pro.log.bets
        .aggregate([
            { $project: { _id: 0, req: { $regexFind: { input: "$requestTimeStamp", regex } }, log: { $regexFind: { input: "$logTimeStamp", regex } } } },
            {
                $project: {
                    sec: { $subtract: [{ $toDate: { $arrayElemAt: ["$log.captures", 0] } }, { $toDate: { $arrayElemAt: ["$req.captures", 0] } }] },
                    microsec: {
                        $subtract: [
                            { $toLong: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$log.captures", 1] }, "000000"] }, 0, 6] } },
                            { $toLong: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$req.captures", 1] }, "000000"] }, 0, 6] } },
                        ],
                    },
                },
            },
            { $project: { micro: { $add: [{ $multiply: ["$sec", 1_000] }, "$microsec"] } } },
            {
                $bucket: {
                    groupBy: "$micro",
                    boundaries: [-Infinity, 0, 100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000, 60_000_000],
                    default: "invalid",
                    output: {
                        cnt: { $sum: 1 },
                        avg: { $avg: "$micro" },
                    },
                },
            },
        ])
        .toArray();
}

{
    const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})[.]?(\d*)[+]\d{2}:\d{2}$/;
    l1_pro_arc.log_arc.bets_bk
        .aggregate([
            { $match: { requestTimeStamp: { $gt: "2023-08-01" } } },
            { $project: { _id: 0, req: { $regexFind: { input: "$requestTimeStamp", regex } }, log: { $regexFind: { input: "$logTimeStamp", regex } } } },
            {
                $project: {
                    sec: {
                        $subtract: [{ $toDate: { $arrayElemAt: ["$log.captures", 0] } }, { $toDate: { $arrayElemAt: ["$req.captures", 0] } }],
                    },
                    microsec: {
                        $subtract: [
                            { $toLong: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$log.captures", 1] }, "000000"] }, 0, 6] } },
                            { $toLong: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$req.captures", 1] }, "000000"] }, 0, 6] } },
                        ],
                    },
                },
            },
            { $project: { micro: { $add: [{ $multiply: ["$sec", 1_000] }, "$microsec"] } } },
            {
                $bucket: {
                    groupBy: "$micro",
                    boundaries: [-Infinity, 0, 100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000, 60_000_000],
                    default: "invalid",
                    output: {
                        cnt: { $sum: 1 },
                        avg: { $avg: "$micro" },
                    },
                },
            },
        ])
        .toArray();
}

// { $group: { _id: "$micro", cnt: { $sum: 1 } } },
//{ $group: { _id: { sec: '$sec', microsec: '$microsec' }, cnt: { $sum: 1 } } },

{
    const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})[.](\d+)[+]\d{2}:\d{2}$/;
    l1_pro_arc.log_arc.bets_bk.aggregate([
        { $match: { requestTimeStamp: { $gt: "2023-08-01" } } },
        { $project: { _id: 0, req: { $regexFind: { input: "$requestTimeStamp", regex } }, log: { $regexFind: { input: "$logTimeStamp", regex } } } },
        {
            $project: {
                secLog: { $toDate: { $arrayElemAt: ["$log.captures", 0] } },
                microsecLog: { $toLong: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$log.captures", 1] }, "000"] }, 0, 6] } },
                secReq: { $toDate: { $arrayElemAt: ["$req.captures", 0] } },
                microsecReq: { $toLong: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$req.captures", 1] }, "000"] }, 0, 6] } },
            },
        },
    ]);
    // .toArray();
}

{
    const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})[.](\d+)[+]\d{2}:\d{2}$/;
    l1_pro_arc.log_arc.bets_bk.aggregate([
        { $match: { requestTimeStamp: { $gt: "2023-08-01" } } },
        { $project: { _id: 0, req: { $regexFind: { input: "$requestTimeStamp", regex } }, log: { $regexFind: { input: "$logTimeStamp", regex } } } },
        {
            $project: {
                secLog: { $arrayElemAt: ["$log.captures", 0] },
                microsecLog: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$log.captures", 1] }, "000"] }, 0, 6] },
                secReq: { $arrayElemAt: ["$req.captures", 0] },
                microsecReq: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$req.captures", 1] }, "000"] }, 0, 6] },
            },
        },
    ]);
    // .toArray();
}

{
    const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})[.]?(\d*)[+]\d{2}:\d{2}$/;
    l1_pro_arc.log_arc.bets_bk.aggregate([
        { $match: { requestTimeStamp: { $gt: "2023-08-01" } } },
        { $project: { req: { $regexFind: { input: "$requestTimeStamp", regex } }, log: { $regexFind: { input: "$logTimeStamp", regex } } } },
        {
            $project: {
                secLog: { $arrayElemAt: ["$log.captures", 0] },
                microsecLog: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$log.captures", 1] }, "000000"] }, 0, 6] },
                secReq: { $arrayElemAt: ["$req.captures", 0] },
                microsecReq: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$req.captures", 1] }, "000000"] }, 0, 6] },
            },
        },
        {
            $match: {
                $or: [{ secLog: "" }, { secLog: null }, { microsecLog: "" }, { microsecLog: null }, { secReq: "" }, { secReq: null }, { microsecReq: "" }, { microsecReq: null }],
            },
        },
    ]);
    // .toArray();
}

{
    const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})[.]?(\d*)[+]\d{2}:\d{2}$/;
    l1_pro_arc.log_arc.bets_bk.aggregate([
        { $match: { requestTimeStamp: { $gt: "2023-08-01" } } },
        { $project: { req: { $regexFind: { input: "$requestTimeStamp", regex } }, log: { $regexFind: { input: "$logTimeStamp", regex } } } },
        {
            $project: {
                secLog: { $toDate: { $arrayElemAt: ["$log.captures", 0] } },
                microsecLog: { $toLong: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$log.captures", 1] }, "000000"] }, 0, 6] } },
                secReq: { $toDate: { $arrayElemAt: ["$req.captures", 0] } },
                microsecReq: { $toLong: { $substrCP: [{ $concat: [{ $arrayElemAt: ["$req.captures", 1] }, "000000"] }, 0, 6] } },
            },
        },
        { $match: { $or: [{ microsecLog: null }, { microsecReq: null }] } },
    ]);
    // .toArray();
}
