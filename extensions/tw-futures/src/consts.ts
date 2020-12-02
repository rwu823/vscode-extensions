import path from 'path'
import pkg from '../package.json'

export const apiObjIDMap = {
  TW_FUTURES: 2,
  TW_FUTURES_NIGHT: 12,
}

export const mediaPath = path.join(__dirname, '../../media')

export const commands = {
  REFRESH: `${pkg.name}.refresh`,
}

const time = {}
