# BodyLog · MVP 功能子任务清单（可执行）

说明：本清单聚焦 MVP 精简范围（无管理员）。所有敏感配置使用环境变量；不编写代码前先完成依赖与结构搭建。勾选顺序建议自上而下。

## 0. 基础与依赖
- [ ] chore(repo): 校验 Node/PNPM/NPM 版本与 Python 版本（Node ≥18，Python ≥3.10）
- [ ] chore(env): 新建 `.env.local`（前端）与 `.env`（后端），占位以下变量（不提交明文）：
  - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY（后端仅用）
  - OPENROUTER_API_KEY（后端）
  - DATABASE_URL（后端直连或 Supabase 连接串）
- [ ] chore(deps-frontend): 安装/校验依赖：`next-intl`、`@supabase/supabase-js`、`recharts`、`react-hook-form`、`zod`、`@hookform/resolvers`、`shadcn/ui`（若未装）
- [ ] chore(deps-backend): 后端依赖列表（`fastapi`, `uvicorn`, `httpx`, `pydantic`, `python-dotenv`）
- [ ] chore(supabase): 初始化本地/远端 Supabase 项目与私有存储桶 `reports`

## 1. 信息架构与路由（Next.js 14 App Router）
- [ ] feat(frontend): 主页 `app/(marketing)/page.tsx`（中/英/日多语言文案 + CTA）
- [ ] feat(frontend): 认证路由 `app/(auth)/auth/login/page.tsx`、`app/(auth)/auth/register/page.tsx`
- [ ] feat(frontend): Dashboard 框架与导航 `app/(app)/dashboard/layout.tsx`、`app/(app)/dashboard/page.tsx`
- [ ] feat(frontend): 上传页 `app/(app)/dashboard/upload/page.tsx`
- [ ] feat(frontend): 我的报告列表 `app/(app)/dashboard/reports/page.tsx`
- [ ] feat(frontend): 报告详情 `app/(app)/dashboard/reports/[reportId]/page.tsx`
- [ ] feat(frontend): 趋势分析 `app/(app)/dashboard/analytics/page.tsx`
- [ ] feat(frontend): 设置页 `app/(app)/dashboard/settings/page.tsx`

## 2. UI 与多语言（shadcn/ui + next-intl）
- [ ] feat(ui): 基础布局与主题，导航栏/侧边栏/面包屑
- [ ] feat(i18n): 集成 `next-intl`：`i18n.ts` 配置 `zh`, `en`, `ja`，默认 `zh`
- [ ] feat(i18n): 语言切换组件 `@/components/lang-switcher.tsx`
- [ ] feat(ui): 表单基座（`react-hook-form + zod`）与通用输入组件（Input/File/Select/Radio）
- [ ] feat(ui): 上传页表单（文件选择 + 校验：类型白名单、≤20MB）
- [ ] feat(ui): 列表与空状态组件（“上传第一份体检报告”）
- [ ] feat(ui): 报告详情页的结构化指标表 + AI 建议卡片
 

## 3. 前端数据层与鉴权（Supabase）
- [ ] feat(auth): 集成 Supabase Auth（邮箱/密码 + Google）前端登录/注册/退出
- [ ] feat(auth): `@/lib/supabase.ts` 客户端封装与会话持久化
- [ ] feat(frontend): 直传 Supabase Storage（桶：`reports`）并获得签名 URL
- [ ] feat(frontend): 报告列表/详情的前端数据流（使用后端 API）
- [ ] feat(frontend): 趋势页读取聚合数据（后端提供序列 API）

## 4. 后端服务（FastAPI）与异步管线（无 OCR/转译）
- [ ] feat(backend): 目录结构 `backend/`：`app/main.py`, `app/routers`, `app/schemas`, `app/services`, `app/db`
- [ ] feat(backend): 健康检查 `GET /healthz`
- [ ] feat(backend): 报告创建 `POST /reports`（入参：文件元数据、签名URL、collected_at、locale），返回 report_id
- [ ] feat(backend): 报告查询 `GET /reports`（分页/状态过滤）、`GET /reports/{id}`（含 normalized 与 AI 建议聚合）
- [ ] feat(backend): 状态查询 `GET /reports/{id}/status`
- [ ] feat(backend): 趋势序列 `GET /analytics/series?keys=blood_glucose.fpg,blood_pressure.systolic,...&range=...`
- [ ] feat(backend): OpenRouter 多模态抽取服务 `services/ai_extraction.py`（输入：签名URL/二进制；输出：标准化 JSON）
- [ ] feat(backend): 单位/别名归一化服务 `services/normalizer.py`（`test_catalog` + 换算）
- [ ] feat(backend): AI 分析服务 `services/ai_analysis.py`（输入：normalized + 历史序列；输出：建议）
- [ ] feat(backend): 抽取/分析异步任务器 `services/worker.py`（基于数据库队列轮询或 FastAPI BackgroundTasks）
- [ ] feat(backend): 错误与审计日志（最小化）

## 5. 数据库（Supabase / PostgreSQL）
- [ ] feat(db): 迁移文件 `supabase/migrations/0001_init.sql`：
  - `reports`（id, user_id, collected_at, locale, status, confidence, source, created_at）
  - `report_files`（id, report_id, path, mime, pages, size, hash, created_at）
  - `parsed_items`（id, report_id, canonical_key, category, value, unit, ref_low, ref_high, flag, confidence, original_value_text, original_unit, original_ref_text, page_ref, display_name, original_names, created_at）
  - `ai_summaries`（id, report_id, summary, recommendations, model, version, created_at）
  - `reports_raw_json`（report_id, jsonb, created_at）
  - `test_catalog`（canonical_key, i18n_label_zh, i18n_label_en, i18n_label_ja, synonyms_zh, synonyms_en, synonyms_ja, canonical_unit, category）
- [ ] feat(db): RLS 策略（按 `user_id`）与必需索引（report_id、canonical_key、created_at）
- [ ] feat(db): 存储桶 `reports`（私有）与签名 URL 有效期策略

## 6. 提示词与 JSON 模板（AI）
- [ ] feat(ai): 抽取提示词模板 `PROMPT_EXTRACT`（要求输出 `normalized + original`，字段与单位严格对齐样例 `health_report_test.json`）
- [ ] feat(ai): 分析提示词模板 `PROMPT_ANALYZE`（输入：本次 normalized + 历史同 key 序列；输出：概览/风险/建议 + 免责声明）
- [ ] feat(ai): 置信度与缺失字段处理策略（<0.85 标红/需要确认；MVP 可先弱化为标记）

## 7. 趋势分析（Recharts）
- [ ] feat(analytics): 默认指标：`blood_glucose.fpg`、`blood_lipids.{tc,tg,ldl_c,hdl_c}`、`blood_pressure.{systolic,diastolic}`
- [ ] feat(analytics): 时间范围选择（30/90 天/年度/自定义）
- [ ] feat(analytics): 悬停/图例开关/数据点无障碍描述

## 8. 非功能与验收
- [ ] perf: 首屏 LCP < 2.5s；上传→反馈 ≤3s；解析/分析 P95 ≤60s
- [ ] sec: 环境变量管理；速率限制（后端 API 级）；签名 URL 短时效
- [ ] qa: 端到端手册与用例（主页→注册→上传→详情→趋势）

## 9. 部署与运行（占位）
- [ ] deploy(frontend): Vercel（环境变量：Supabase URL/Anon Key、默认语言）
- [ ] deploy(backend): AWS（或自托管）运行 FastAPI + Worker；配置 OPENROUTER_API_KEY
- [ ] deploy(db): Supabase 生产库与存储桶；启用 RLS 与备份

---

提示：以上均为任务分解文档，未包含任何敏感密钥与具体实现代码。执行时请按模块逐步完成与验收。

## Backlog（Post‑MVP）
- [ ] feat(pdf-backend): 导出 PDF API `GET /reports/{id}/export.pdf`
- [ ] feat(pdf-template): 导出模板（标题/日期/关键指标表 + AI 建议 + 免责声明）
- [ ] feat(pdf-i18n): 字体与本地化（中/英/日字符集兼容）
- [ ] feat(pdf-frontend): 前端导出按钮与进度反馈
