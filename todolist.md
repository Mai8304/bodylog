# BodyLog · ToDo List（持续维护）

说明：本清单用于跟踪当前迭代任务，完成后立即勾选。优先聚焦 Dashboard 端到端（上传→抽取→归一化→入库→展示），其余任务放入后续阶段。

## ✅ 已完成
- [x] docs: 创建 `PRD.md`（V0.3.1 精简版）
- [x] docs: 创建 `featurelist.md`（MVP 子任务清单）

## Phase A（优先）：Dashboard 端到端闭环（Next.js + Supabase Edge Functions）
- [x] chore(deps-frontend): 安装 `next-intl @supabase/supabase-js recharts react-hook-form zod @hookform/resolvers`
- [x] chore(cli): 安装 Supabase CLI（本地开发与 Edge Functions）
- [x] chore(env-frontend): 配置前端 `.env.local`（`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_I18N_DEFAULT=zh`）
- [x] chore(env-functions): 配置 Edge Functions 环境变量（`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, `OPENROUTER_API_BASE=https://openrouter.ai/api/v1`, `REPORTS_BUCKET=reports`, `ALLOWED_UPLOAD_MIME=image/jpeg,image/png,image/jpg,image/bmp,application/pdf`, `SIGNED_URL_TTL=900`）
- [x] feat(supabase-storage): 创建私有存储桶 `reports`
- [ ] feat(storage-policies): 配置 Storage RLS 策略（仅本人路径可读写；后端用签名URL）
- [x] chore(deps-auth-helper): 安装 `@supabase/auth-helpers-nextjs`
- [x] chore(deps-radix): 安装 `@radix-ui/react-slot @radix-ui/react-label @radix-ui/react-tabs @radix-ui/react-scroll-area`
- [x] feat(db-migration): 编写并应用 MVP 最小表结构迁移（reports/report_files/reports_raw_json/parsed_items/ai_summaries/test_catalog + 枚举）
- [x] feat(db-rls): 为上述表配置 RLS（按 `user_id`）与必要索引
- [ ] feat(api-next): 定义并实现 BFF API（`app/api/reports/route.ts`, `app/api/reports/[id]/route.ts`, `app/api/reports/[id]/status/route.ts`, `app/api/analytics/series/route.ts`）
- [ ] feat(edge-func): 初始化 `supabase/functions/process-report/index.ts`（HTTP 触发）
- [ ] feat(edge-extract): 在 Edge Function 中调用 OpenRouter 多模态抽取（无 OCR/转译），输出标准化 JSON（normalized + original）
- [ ] feat(edge-normalize): 在 Edge Function 中完成别名映射与单位换算（基于 `test_catalog`），写入 `parsed_items` 与 `reports_raw_json`
- [ ] feat(edge-analyze): 在 Edge Function 中生成 AI 建议（读取本次与历史），写入 `ai_summaries` 并更新 `reports.status=completed`
- [x] feat(frontend-router): 搭建 Dashboard 路由骨架（概览/上传/我的报告/详情/趋势/设置）
- [ ] feat(auth-server): 新建 `lib/supabase/server.ts` 并在 `app/[locale]/layout.tsx` 注入 session
- [ ] feat(auth-protect): 在 Dashboard 布局校验登录态（未登录重定向到 `/[locale]/auth/login`）
- [ ] feat(auth-callback): 实现 `/api/auth/callback` 处理 Supabase OAuth & session cookie
- [ ] feat(auth-ui): 登录/注册页接入 Supabase Auth（邮箱密码 + Google），成功后跳转 Dashboard
- [ ] feat(auth-home-redirect): 首页检测登录态并跳转 `/[locale]/dashboard`
- [ ] feat(auth): 集成 Supabase Auth（邮箱/密码 + Google），保护 Dashboard 路由
- [x] feat(frontend-upload): 上传页（单文件≤20MB白名单）直传 Storage + 调用 `POST /api/reports`
- [x] feat(frontend-reports): 我的报告列表与详情页（轮询或刷新获取结构化结果与 AI 建议）
- [x] feat(frontend-analytics): 趋势页从 `GET /api/analytics/series` 渲染血糖/血脂/血压
- [x] feat(theme): 应用清透医疗蓝青配色（全局 CSS 变量与语义色）
- [x] landing(theme): 首页布局与视觉更新（Hero/卖点/How/功能/FAQ/CTA/页脚）
- [ ] qa(e2e): 手动走查“主页→登录→上传→（状态）→详情→趋势”，记录问题
- [ ] qa(auth-flow): 手动走查“首页→注册/登录→Dashboard→退出”，覆盖 Google 登录

## Phase B（并行/辅助）
- [ ] feat(i18n): 集成 `next-intl` 词条与语言切换组件
- [ ] feat(ui): 完善 shadcn/ui 主题、表单与空状态
- [ ] chore(test_catalog): 预填关键 canonical_key（GLU、TC/TG/LDL/HDL、SBP/DBP 等）
- [ ] chore(logging): 记录抽取/分析耗时与错误码，便于后续监控

## 部署与交付（确认后执行）
- [ ] chore(git-flow): 配置 GitHub 远端与分支策略（本地验证后同步）
- [ ] deploy(vercel): 前端部署到 Vercel（配置 `NEXT_PUBLIC_*` 环境变量）
- [ ] deploy(edge-functions): 部署 Supabase Edge Functions（配置服务端密钥与 OpenRouter Key）

## Backlog（Post‑MVP）
- [ ] feat(pdf): 导出 PDF（关键指标表 + AI 建议 + 免责声明）
