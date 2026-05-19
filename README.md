# vite-plugin-build-console

<div align="center">

[![npm version](https://img.shields.io/npm/v/vite-plugin-build-console.svg)](https://www.npmjs.com/package/vite-plugin-build-console)
[![npm downloads](https://img.shields.io/npm/dm/vite-plugin-build-console.svg)](https://www.npmjs.com/package/vite-plugin-build-console)
[![license](https://img.shields.io/npm/l/vite-plugin-build-console.svg)](https://github.com/InsHomePgup/vite-plugin-build-console/blob/main/LICENSE)

</div>

<p align="center">
  <b>构建完成后在控制台输出构建摘要，并自动将产物压缩为 ZIP 文件</b>
</p>

## 简介

`vite-plugin-build-console` 是一个 Vite 插件。每次 `vite build` 完成后，它会在控制台打印一份彩色摘要，包含构建耗时、产物体积、输出目录以及指定的环境变量，同时自动将产物目录压缩成带版本号的 ZIP 包，便于传输和部署。

## 特性

- 显示构建状态、耗时、产物体积、输出目录
- 过滤并展示 `.env` 中的自定义环境变量（自动排除 Vite 内置变量 `MODE` / `BASE_URL` / `DEV` / `PROD` / `SSR`）
- 构建完成后自动将产物目录打包为 ZIP，命名格式为 `{name}-{version}.zip`（读取项目 `package.json`）
- 支持自定义 ZIP 输出目录
- 可选显示插件自身版本号

## 安装

```bash
# npm
npm install vite-plugin-build-console -D

# yarn
yarn add vite-plugin-build-console -D

# pnpm
pnpm add vite-plugin-build-console -D
```

## 使用

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { consoleBuildInfo } from 'vite-plugin-build-console'

export default defineConfig({
  plugins: [
    consoleBuildInfo()
  ]
})
```

## 配置项

```typescript
consoleBuildInfo(options?: BuildConsoleOptions)
```

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `envString` | `string[]` | `undefined` | 指定要展示的环境变量 key 列表。不传则展示所有自定义环境变量（排除 Vite 内置变量）；传空数组则不展示任何环境变量 |
| `showPluginVersion` | `boolean` | `false` | 是否在摘要中显示插件版本号 |
| `zipDir` | `string` | `'.'`（项目根目录） | ZIP 文件的输出目录 |

## 示例

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { consoleBuildInfo } from 'vite-plugin-build-console'

export default defineConfig({
  plugins: [
    consoleBuildInfo({
      envString: ['VITE_API_URL', 'VITE_APP_VERSION'],
      showPluginVersion: true,
      zipDir: 'releases',
    })
  ]
})
```

构建完成后控制台输出示例：

```
╭──────────────────────────────────────────────────────────────────╮
│                                                                  │
│         🚀 构建信息摘要                                          │
│         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│         ✅ 构建状态: 成功完成                                    │
│         ⏱️ 构建用时: 00分05秒                                    │
│         📦 包体积: 2.50 MB                                       │
│         📂 输出目录: dist                                        │
│         🔌 插件版本: 2.0.1                                       │
│                                                                  │
│         🌐 环境变量:                                             │
│         • VITE_API_URL: https://api.example.com                  │
│         • VITE_APP_VERSION: 1.0.0                                │
│         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                  │
╰──────────────────────────────────────────────────────────────────╯
```

ZIP 文件会同时生成到 `releases/my-app-1.0.0.zip`。

## 工具函数

插件同时导出两个可独立使用的工具函数：

### `calcFolderSize({ dirPath })`

异步计算目录大小，返回格式化后的字符串（如 `2.50 MB`）。

```typescript
import { calcFolderSize } from 'vite-plugin-build-console'

const size = await calcFolderSize({ dirPath: 'dist' })
console.log(size) // '2.50 MB'
```

### `packFolder(options)`

将指定目录压缩为 ZIP 文件。

```typescript
import { packFolder } from 'vite-plugin-build-console'

packFolder({
  dirPath: 'dist',        // 要压缩的目录
  projectName: 'my-app', // 项目名（用于生成文件名）
  version: '1.0.0',      // 版本号（用于生成文件名）
  outDirPath: '.',        // ZIP 输出目录，默认为 '.'
  // packPre: 'prefix',  // 可选：文件名前缀，生成 prefix-my-app-1.0.0.zip
  // packFullName: 'custom.zip', // 可选：完全自定义文件名
})
```

文件命名规则（优先级从高到低）：

1. `packFullName` — 完全自定义名称
2. `packPre` — `{packPre}-{projectName}-{version}.zip`
3. 默认 — `{projectName}-{version}.zip`

## 许可证

[MIT](LICENSE)
