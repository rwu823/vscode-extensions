import got from 'got'
import * as date from 'date-fns'
import { parseFromTimeZone } from 'date-fns-timezone'

import WebSocket from 'ws'

export const getTWZone = () =>
  parseFromTimeZone(new Date().toString(), {
    timeZone: 'Asia/Taipei',
  })

export const getTW3PMClockOfToday = () =>
  date.set(getTWZone(), {
    hours: 15,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })

const apiBase = `https://www.wantgoo.com`
const UserAgentChrome87Desktop = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36`

export const stockAPI = got.extend({
  prefixUrl: apiBase,
  responseType: 'json',
  headers: {
    'user-agent': UserAgentChrome87Desktop,
  },
})

export const realtime = stockAPI.extend({
  prefixUrl: `${apiBase}/stock/techchart/realtimedata`,
})

interface StockInfo {
  Id: string
  Name: string
  Market: number
  Open: number
  High: number
  Low: number
  Close: number
  PreviousClose: number
  Change: number
  ChangePercent: number
  CommodityId: string
  TotalVolume: number
  Time: string
  Mean60Distance: number
  Mean60DistanceRate: number
  CommodityState: CommodityState
}

interface CommodityState {
  Id: string
  Nearby1: string
  Nearby2: string
  Morning: Morning
  Night: Morning
  Whole?: any
}

interface Morning {
  Start: string
  End: string
}
export const getPoints = () =>
  Promise.all(
    ['WTX&', 'WTXP&', 'B1YM&', 'NAS', 'SP5', 'USDINDEX'].map((stockNo) =>
      realtime.get<{ StockInfo: StockInfo }>('', {
        searchParams: {
          stockNo,
          topDays: '1',
        },
      }),
    ),
  ).then((res) => res.map((r) => r.body.StockInfo))

const ws = new WebSocket(
  'wss://stream143.forexpros.com/echo/767/2yrvu2lt/websocket',
  {
    headers: {
      'Sec-WebSocket-Key': '+fVs9C/1cXAcrYcvEamvuQ==',
    },
  },
)

ws.on('message', (data) => {
  console.info(data, 111)
})
