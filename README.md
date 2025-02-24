# vite-plugin-build-console

>Description
> Output build info when building

vite插件

打包时打印环境变量等信息

环境变量，版本信息，调用api地址，public_path...

打包完成后添加到zip包方便传输。

```
pnpm add vite-plugin-build-console
```


``` typescript
// vite.config.ts
import { consoleBuildInfo } from 'vite-plugin-build-console'

export default defineConfig({
plugins:[
...,
consoleBuildInfo()
],
  build:{  // 指定计算大小和zip压缩的目标path
    outDir:'otherDist'
  }
})
```
