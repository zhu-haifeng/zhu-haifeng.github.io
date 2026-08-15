---
title: 用 AI，搭一个真正属于自己的博客
description: 从个人归档的需求出发，调研静态博客、内容管理与部署，再复盘这个 Astro 博客是怎样搭起来的。
publishedAt: 2026-08-15
cover: /images/build-personal-blog-with-ai/cover.jpg
coverAlt: BUILD A PERSONAL BLOG 的工程风格封面
section: 互联网观察
tocDepth: 2
tags:
  - AI
  - 博客
  - Astro
  - 静态站点
draft: false
---

<div class="ai-blog-marker" aria-hidden="true"></div>

<figure class="ai-blog-cover">
  <img src="/images/build-personal-blog-with-ai/cover.jpg" alt="BUILD A PERSONAL BLOG 的工程风格封面" loading="eager" decoding="async">
</figure>

<div class="ai-blog-lead">我时不时会想写点文字，记录一下所思、所感和所学。发在平台上当然方便，但时间一长，内容往往散在不同账号、不同推荐流里；页面样式、分发规则和数据留存也都不由我决定。于是我开始想：能不能搭一个简单、方便的个人博客，把文章好好存档？</div>

这个念头最终把我带到了静态博客。它不是什么复古玩具，而是一种很适合个人写作者的出版方式：文章是自己保存的文件，网页是从文件构建出来的结果，站点可以部署在自己的域名下。AI 则把原本需要从零摸索的建站过程，变成了一次可以不断对话、验证和迭代的工程实践。

调研同类搭建文章后我发现，大家很容易把注意力放在“十分钟上线”，但真正决定一个博客能不能存活下来的，往往是上线之后的内容管理、链接稳定性和迁移能力。

## 为什么是静态博客

打开一篇普通网页，浏览器最终读到的是 HTML；排版由 CSS 决定；目录、暗色模式这类小交互通常由 JavaScript 完成。动态网站则会在每次访问时向服务器请求数据、再生成页面。静态博客走了另一条路：在发布前，先把文章和模板编译成一组现成的 HTML、CSS、JavaScript 文件；读者访问时，服务器只需要把这些文件交出去。

这对个人写作很合适。我的写作频率低，读者访问以阅读为主，不需要为了每一次打开文章都启动数据库、用户系统和服务端渲染。复杂度没有消失，只是从“每一次访问”提前到了“每一次发布”。代价是发布前要构建一次，换来的则是更低的运行成本、更少的故障点和更容易迁移的内容资产。

“静态”也不意味着页面简陋。RSS 用于订阅，sitemap 告诉搜索引擎站点有哪些页面，Open Graph 决定链接被分享到社交平台时呈现的标题和封面；它们都可以随构建自动生成。

性能也有明确的验收依据。Google 的 Core Web Vitals 将 **LCP 2.5 秒以内**、**INP 200 毫秒以内**、**CLS 0.1 以内**定义为“良好”。这些数字不是博客的成绩单，但提醒我们，读者首先需要的是稳定、迅速地读到内容。

<div class="ai-blog-metrics">
  <div><b>2.5s</b><span>LCP 的良好阈值：主要内容尽快出现。</span></div>
  <div><b>200ms</b><span>INP 的良好阈值：交互及时响应。</span></div>
  <div><b>0.1</b><span>CLS 的良好阈值：阅读过程不跳动。</span></div>
</div>

## 文章怎么写、怎么管

搭博客时，最容易把精力花在主题颜色和首屏动画上；但真正决定它能否持续使用的，是文章如何被保存和管理。我的选择是 Markdown：它是一种带有少量标记的纯文本格式，标题、引用、链接和图片都可以直接写在文件里。它的好处不在于“极客”，而在于文件是自己的，换编辑器、换框架、换托管平台也不会失去文章。

内容管理大致有三条路。

<div class="ai-frameworks">
  <article class="wordpress"><b>WordPress</b><span>后台与插件成熟；适合多人协作或需要复杂编辑后台的站点。</span></article>
  <article class="hugo"><b>Hugo</b><span>输出纯静态文件，依赖少，适合偏配置与命令行的写作者。</span></article>
  <article class="astro"><b>Astro</b><span>内容集合 + 组件化页面；静态优先，也能保留必要交互。</span></article>
</div>

这里没有绝对最优解，只有与自己的维护意愿是否匹配。对个人项目而言，比“用了哪一个框架”更重要的是两条原则：文章和图片必须能脱离框架独立保存；文章字段要能在构建时校验。前者保证将来可迁移，后者避免发布日期、摘要或封面替代文本悄悄缺失。

一篇文章至少应有标题、摘要、发布日期、封面替代文本、栏目和标签。以 Astro 为例，内容集合会在构建时校验这些字段：少写了日期、图片路径失效，错误会在发布前暴露，而不会等读者打开页面才发现。

## 从框架走到上线

框架只解决“如何生成网页”，并不自动解决“网页放在哪里”。一个完整的上线过程通常是：在本地初始化项目，写入第一篇文章，执行构建命令，检查构建产物，再推送到代码仓库，由部署平台发布到公开地址。

GitHub Pages 是最常见的低门槛选择之一：它可以直接托管静态文件，也能通过 GitHub Actions 在代码推送后自动构建与发布。这条链路的关键不在命令本身，而在于每一步都有可观察的结果：开发服务器让你本地看排版；构建命令确保生产环境能生成完整页面；预览命令让你看到的不是开发版，而是真正准备上线的文件。

<pre class="ai-blog-terminal"><code># 一个静态站点的最小闭环
pnpm dev      # 本地写作与预览
pnpm build    # 校验并生成可发布文件
pnpm preview  # 按生产方式检查构建结果
git push      # 触发自动部署</code></pre>

这里有一个同类教程里经常被略过、但很容易踩坑的细节：GitHub Pages 既可以把站点放在 `用户名.github.io` 根路径，也可以放在某个项目仓库对应的子路径。后者需要让框架知道站点的 `base` 路径，否则图片、样式和文章链接在本地正常、上线后却可能全部指向错误位置。若使用自己的域名，还要在域名服务商处配置 DNS 记录，并在 Pages 设置中完成域名与 HTTPS 校验；这些步骤应以 GitHub 的官方配置页为准，不建议让 AI 凭记忆生成一串 DNS 值。

上线不是结束。后期管理应该尽量回到一件简单的事：新建一个 Markdown 文件，补齐元数据，放入图片，在本地预览后提交。与此同时，内容和图片在本地仓库有副本，构建失败时不发布，站点生成 RSS、sitemap 和规范链接。这样即使未来更换框架或托管平台，迁移的是一组文件，而不是从某个平台“抢救”内容。

> AI 可以写初版、查错、解释配置；但“内容是否属于我、发布是否可回滚、每次更新是否可验证”，仍然需要由人来决定。

## 我的博客是怎样搭起来的

<div class="ai-case-label">CASE FILE / MY PRACTICE</div>

落实到这个博客，我选择了 Astro，并且把站点配置为静态输出。文章统一放在 `src/content/posts/` 中，以 Markdown 保存；页面通过内容集合读取文章，再根据模板生成首页、文章页、RSS 和 sitemap。这样一来，写新文章不需要进入某个网站后台，只需要创建和编辑一个文件。

内容上，它不是只放技术笔记。现在的站点把几条线索放在同一个归档里：有从天坛、故宫到北京中轴线展开的[北京游记](/posts/beijing/)，有拆解线上娱乐人格测试传播逻辑的[SBTI 观察](/posts/sbti/)，也有关于[东野圭吾作品](/posts/higashino-keigo/)和话剧社活动的记录。它们的主题不同，但最终都落在同一件事上：把值得留下的经历、判断和兴趣整理成可长期回看的文本。

<div class="ai-blog-metrics ai-blog-metrics-case">
  <div><b>7</b><span>内容集合中的 Markdown 文章。</span></div>
  <div><b>163</b><span>仓库内图片资源。</span></div>
  <div><b>0</b><span>公开访问所需的常驻应用进程。</span></div>
</div>

站点还维护了文章目录、深色模式、RSS、sitemap 和 changelog。对读者而言，这些细节未必显眼；但对于一个要持续写下去的站点，它们构成了“能长期使用”的基础。

我也给仓库加了一个很实际的校验：构建前扫描文章中的图片路径。旅行文章这种图片很多的内容，最怕搬动文件后留下失效链接；把这件事交给脚本，就比上线后逐张检查可靠得多。AI 在这里帮我处理了脚本、结构和样式的初版，但每一项功能最后都要回到真实浏览器和构建日志里验收。

最初“想有个地方存档”的愿望，到这里才真正落地：文章不再依附于单个平台，而是一份份可以打开、编辑、备份和重新发布的文件。博客不是为了逃离所有平台，而是在平台之外，为自己的写作留一份确定的、可控的归档。

## 参考

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro + GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [web.dev / Web Vitals](https://web.dev/articles/vitals)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
