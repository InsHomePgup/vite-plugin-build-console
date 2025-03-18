# vite-plugin-build-console

<div align="center">

[![npm version](https://img.shields.io/npm/v/vite-plugin-build-console.svg)](https://www.npmjs.com/package/vite-plugin-build-console)
[![npm downloads](https://img.shields.io/npm/dm/vite-plugin-build-console.svg)](https://www.npmjs.com/package/vite-plugin-build-console)
[![license](https://img.shields.io/npm/l/vite-plugin-build-console.svg)](https://github.com/yourusername/vite-plugin-build-console/blob/main/LICENSE)

</div>

<p align="center">
  <b>一个用于在构建过程中输出构建信息的Vite插件</b>
</p>

## 📖 简介

vite-plugin-build-console 是一个Vite插件，用于在构建过程中输出有用的信息，如环境变量、构建时间、包体积等。同时，它还可以将构建产物打包成zip文件，方便传输和部署。

## ✨ 特性

| 特性 | 状态 | 描述 |
| --- | --- | --- |
| 📊 构建信息输出 | ✅ | 打包时打印环境变量等信息 |
| 🕒 构建时间统计 | ✅ | 显示构建所用时间 |
| 📦 包体积计算 | ✅ | 计算并显示构建产物的大小 |
| 🔢 版本信息显示 | ✅ | 显示插件版本和项目版本 |
| 🌐 环境变量显示 | ✅ | 显示.env文件中的环境变量 |
| 📎 ZIP打包 | ✅ | 打包完成后添加到zip包方便传输 |
| 🎨 自定义输出样式 | 🚧 | 自定义输出信息的样式和颜色 |
| 📱 移动端适配 | 🚧 | 针对移动端项目的特殊优化 |
| 📊 构建性能分析 | 🚧 | 分析构建过程中的性能瓶颈 |

✅ 已完成  &nbsp; 🚧 开发中

## 📦 安装

```bash
# npm
npm install vite-plugin-build-console -D

# yarn
yarn add vite-plugin-build-console -D

# pnpm
pnpm add vite-plugin-build-console -D
 ```


## 🚀 使用
在你的 vite.config.ts 文件中添加插件：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { consoleBuildInfo } from 'vite-plugin-build-console'

export default defineConfig({
  plugins: [
    consoleBuildInfo({
      // 配置选项
      envString: ['VITE_API_URL', 'VITE_APP_VERSION'], // 指定要显示的环境变量
      showPluginVersion: true // 是否显示插件版本
    })
  ],
  build: {  // 指定计算大小和zip压缩的目标path
    outDir: 'dist'
  }
})
 ```

## ⚙️ 配置选项

| 选项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `envString` | `string[]` | `undefined` | 指定要显示的环境变量列表，如果不指定则显示所有环境变量 |
| `showPluginVersion` | `boolean` | `true` | 是否显示插件版本号 |


## 📝 示例
构建完成后，控制台将输出类似以下内容：

```plaintext
┌────────────────────────────────────────────────────┐
│                                                    │
│        🎉 打包完成（用时00分05秒，包体积：2.5MB）    │
│        outDir:dist                                 │
│        插件版本: 1.0.0                             │
│        VITE_API_URL: https://api.example.com       │
│        VITE_APP_VERSION: 1.0.0                     │
│                                                    │
└────────────────────────────────────────────────────┘
 ```

## 🤝 贡献
欢迎提交问题和功能请求！也欢迎提交PR。

## 📄 许可证
MIT