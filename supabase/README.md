# Supabase 数据库与存储（BodyLog）

本目录包含数据库迁移与初始化脚本。建议在本地验证通过后，再推送到远端项目。

## 目录结构
- `migrations/0001_init.sql`：MVP 初始化（枚举、表、索引、RLS、最小 test_catalog 预置）

## 本地/远端应用（命令参考）
1) 登录与关联项目
```
supabase login
supabase link --project-ref <你的 project ref>
```

2) 推送迁移到远端（或在本地 dev 容器中应用）
```
supabase db push
```

3) 验证 RLS 与表结构
- 在 SQL Editor 查看 `public.*` 表和 `test_catalog` 预置
- 用 SQL 测试 `auth.uid()` 的 RLS 生效情况

注意
- 请勿将 `.env`/`.env.local` 提交到仓库。
- Storage 桶 `reports` 的策略（仅本人路径可读写）请在控制台或 SQL 中另行配置。
