# acnh-bot
A Discord bot for Animal Crossing New Horizons

## JSON Format
{
  fish:[
    {
      name: "`魚の名前`",
      price: `買取額`,
      place: "`採れる場所`",
      season: [`いつでもフラグ`,`1月`,`2月`, ... ,`11月`,`12月`],
      time: [`0時`,`1時`,`2時`, ... ,`22時`,`23時`]
    },
    {
      <others continuously>
    }
  ]
}
