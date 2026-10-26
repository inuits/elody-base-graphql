import jwtDecode from 'jwt-decode'
import { envConfig } from './libConfig'

export const logToken = (_accesstoken: string | undefined, _subject: string, _context?: string, full = false) => {
  if (envConfig.tokenLogging == 'true') {
    let tokenPart = ''
    logTime()
    if (_accesstoken) {
      full === true ? tokenPart = _accesstoken : tokenPart = _accesstoken.substring(_accesstoken.length - 10, _accesstoken.length)
      logUser(_accesstoken)
    }
    console.log(`\n${_subject} ${_context ? '| ' + _context : ''} `, tokenPart)
  }
}

export const logUser = (accessToken: string | undefined) => {
  if (envConfig.tokenLogging == 'true' && accessToken) {
    const user = jwtDecode(accessToken!) as any
    user && user.email ? console.log(`\nUser email => ${user.email}`) : null
  }
}

export const logTime = () => {
  if (envConfig.tokenLogging == 'true') {
    console.log(`\n\n[${new Date().toDateString()} ${new Date().toLocaleTimeString()}]`)
  }
}
