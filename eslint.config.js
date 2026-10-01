import globals from 'globals'
import { plugins, rules } from '@trojs/lint'

const compatibleRules = Object.fromEntries(
  Object.entries(rules.all).filter(([ruleName]) => {
    if (!ruleName.startsWith('sonarjs/')) return true
    return Object.hasOwn(plugins.sonarjs.rules, ruleName.slice('sonarjs/'.length))
  })
)

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2025,
        ...globals.browser,
        localStorage: 'readonly'
      }
    },
    settings: {
      jsdoc: {
        mode: 'typescript'
      }
    },
    plugins: {
      ...plugins
    },
    rules: {
      ...compatibleRules
    },
    files: ['**/*.js']
  }
]
