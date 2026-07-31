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
    summary: '补充站点更新记录与公众号信息。',
    changes: [
      { kind: '新增', text: '新增更新日志页面与导航入口。' },
      { kind: '新增', text: '关于页面加入“山月随想录”公众号二维码及备份说明。' },
      { kind: '优化', text: '加入相关推荐、折叠目录、灯箱切换，并更新部分文章封面。' },
      { kind: '新增', text: '支持跟随系统的夜间模式与手动切换。' },
    ],
  },
  {
    version: 'v1.0.0',
    date: '2026-07-30',
    title: '博客站点初版',
    summary: '完成 Joseph 个人博客的基础搭建与首批内容整理。',
    changes: [
      { kind: '新增', text: '搭建博客基础页面并迁入首批文章。' },
      { kind: '新增', text: '加入阅读辅助、RSS、站点地图及响应式布局。' },
    ],
  },
];
