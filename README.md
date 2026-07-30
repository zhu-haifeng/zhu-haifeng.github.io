# 山月随想录

基于 Astro 的纯静态个人博客，部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建结果位于 `dist/`，不需要运行服务器即可部署。

## 写新文章

在 `src/content/posts/` 中新增 Markdown 文件，并填写以下 frontmatter：

```yaml
---
title: 文章标题
description: 文章摘要
publishedAt: 2026-07-31
cover: /images/example.jpg
coverAlt: 封面图片说明
tags:
  - 旅行
draft: false
---
```

推送到 `master` 分支后，GitHub Actions 会自动构建并发布。

## 导入北京游记

运行：

```bash
node scripts/import-beijing.mjs
```

脚本会从相邻工作区读取微信公众号 Markdown，并转换本机图片路径和横竖版样式。
