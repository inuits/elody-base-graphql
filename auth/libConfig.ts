import { EnvConfig } from './types';

export let envConfig: EnvConfig = {
  tokenLogging: 'false',
  staticJWT: null,
}

export const applyConfig = (_config: EnvConfig) => {
  let configIsSet = false
  let keysNotSet = []
  if (_config) {
    for (let index = 0;index < Object.keys(envConfig).length;index++) {
      const key = Object.keys(envConfig)[index]
      if (key in _config) {
        if (_config[key as keyof EnvConfig]) {
          envConfig[key as keyof EnvConfig] = _config[key as keyof EnvConfig] as any
        }

      } else {
        keysNotSet.push(key)
      }
    }
    configIsSet = true
  } else {
    configIsSet = false
  }
  keysNotSet.length >= 1 ? console.log(`=> keys not explicitly set`, keysNotSet) : null
  console.log(`=> Environment auth config is set`, configIsSet)
}