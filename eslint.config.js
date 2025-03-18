// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    ignores: [
      'pnpm-lock.yaml',
      'README.md',
    ],
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
)
