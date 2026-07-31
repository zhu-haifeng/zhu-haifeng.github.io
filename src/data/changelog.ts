export type ChangeKind = '新增' | '优化' | '修复';

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  summary: string;
  changes: Array<{
    kind: ChangeKind;
    text: string;
  }>;
}

// 新记录放在数组顶部，页面会按这里的顺序展示。
export const changelog: ChangelogEntry[] = [
  {
    version: 'v1.1.0',
    date: '2026-07-31',
    title: '更新日志上线',
    summary: '为博客增加一处长期记录站点变化的公开档案。',
    changes: [
      { kind: '新增', text: '新增独立的更新日志页面，并在主导航中提供入口。' },
      { kind: '新增', text: '支持按版本记录新增、优化与修复内容。' },
      { kind: '优化', text: '针对桌面端和移动端调整时间线布局与导航间距。' },
    ],
  },
  {
    version: 'v1.0.0',
    date: '2026-07-30',
    title: '博客站点初版',
    summary: '完成 Joseph 个人博客的基础搭建与首批内容整理。',
    changes: [
      { kind: '新增', text: '使用 Astro 搭建首页、文章详情、关于与话剧社栏目。' },
      { kind: '新增', text: '迁入北京游记、东野圭吾作品笔记、SBTI 测试及话剧社相关内容。' },
      { kind: '新增', text: '加入文章目录、阅读进度、图片灯箱、RSS 与站点地图。' },
      { kind: '优化', text: '完成桌面端与移动端的响应式排版。' },
    ],
  },
];
