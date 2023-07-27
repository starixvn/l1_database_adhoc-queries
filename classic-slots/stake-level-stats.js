{
  const db = l1_pro.minigame;
  const games = db.game_configs
    .find({ type: 2 }, { _id: 0, name: 1, gameId: 1 })
    .toArray();
  console.table(games);

  let data = [];
  games.forEach(({ name }) => {
    const res = db
      .getCollection(`${name}_rounds`)
      .aggregate([
        { $match: { paid: true, currency: { $ne: "UUS" } } },
        { $project: { _id: 0, bet: 1, currency: 1 } },
        {
          $group: {
            _id: { bet: "$bet", currency: "$currency" },
            cnt: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            game: { $literal: name },
            bet: "$_id.bet",
            currency: "$_id.currency",
            cnt: "$cnt",
          },
        },
      ])
      .toArray();
    console.log(name, JSON.stringify(res));

    data = data.concat(res);
  });

  console.log(data);
}

{
  const db = l2_pro.minigame;
  const db_arc = l2_pro_arc.minigame_arc;
  const games = db.game_configs
    .find({ type: 2 }, { _id: 0, name: 1, gameId: 1 })
    .toArray();
  console.table(games);

  let data = [];
  games.forEach(({ name }) => {
    const res = db_arc
      .getCollection(`${name}_rounds_bk`)
      .aggregate([
        { $match: { paid: true, currency: { $ne: "UUS" } } },
        {
          $project: {
            _id: 0,
            bet: 1,
            currency: 1,
            paylines: { $size: "$paylines" },
          },
        },
        {
          $group: {
            _id: { bet: "$bet", currency: "$currency", paylines: "$paylines" },
            cnt: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            game: { $literal: name },
            bet: "$_id.bet",
            currency: "$_id.currency",
            noPaylines: "$_id.paylines",
            cnt: "$cnt",
          },
        },
      ])
      .toArray();

    data = data.concat(res);
    console.log(name);
  });

  console.log(JSON.stringify(data));
  console.log(data.length);
}
