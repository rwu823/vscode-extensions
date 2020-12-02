import got from 'got'

export const stockAPI = got.extend({
  prefixUrl: `https://www.taifex.com.tw`,
  responseType: 'json',
})
