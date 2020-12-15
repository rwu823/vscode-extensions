import got from 'got'
import * as date from 'date-fns'
import { parseFromTimeZone } from 'date-fns-timezone'

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

const apiBase = `https://www.wantgoo.com/investrue`
const UserAgentChrome87Desktop = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36`

export const stockAPI = got.extend({
  prefixUrl: apiBase,
  responseType: 'json',
  headers: {
    'user-agent': UserAgentChrome87Desktop,
  },
})

export const featuresNight = stockAPI.extend({
  prefixUrl: `${apiBase}/wtxp&`,
})

export const features = stockAPI.extend({
  prefixUrl: `${apiBase}/wtx&`,
})

export const getPoints = () =>
  Promise.all([
    features<{ flat: number }>({ url: 'commoditystate' }),
    features<{ bidPrice1: number }>({ url: `toponepieces` }),

    // 夜盤
    featuresNight<{ flat: number }>({ url: 'commoditystate' }),
    featuresNight<{ bidPrice1: number }>({ url: `toponepieces` }),
  ]).then(
    ([
      {
        body: { flat: base },
      },
      {
        body: { bidPrice1: close },
      },

      {
        body: { flat: nightBase },
      },
      {
        body: { bidPrice1: nightClose },
      },
    ]) => {
      return [
        {
          name: '台指期',
          base,
          close,
        },
        {
          name: '台指期(夜)',
          base: nightBase,
          close: nightClose,
        },
      ]
    },
  )
