# BodyLog PRD · V0.3.1（MVP 精简版）

版本：V0.3.1  · 状态：对齐中（可演进） · 日期：2025-09-23  
负责人：产品/研发联合  · 文档路径：`PRD.md`（持续版本化）

## 一、产品概述
- 名称：BodyLog（域名：bodylog.ai）
- 定位：医疗健康类网站，支持用户上传体检报告（图片/PDF），自动抽取关键指标，统一格式化并入库，基于历史数据与本次结果由 AI 生成健康建议。
- 平台与技术栈：
  - 前端：Next.js 14（App Router）+ React + TypeScript + Tailwind CSS + shadcn/ui + next-intl（多语言）+ Recharts（图表）
  - 后端：FastAPI（Python）
  - 数据库与鉴权：Supabase（PostgreSQL + Storage + Auth）
  - AI：OpenRouter（如 ChatGPT-4o 等多模态模型）
- 语言与本地化：默认中文，支持英文/日文；UI 自适应移动/桌面。
- 合规与隐私：用户数据仅本人可见；管理员功能不在 MVP；所有敏感配置通过环境变量管理。

## 二、MVP（精简版）范围
1) 主页与认证
   - 主页展示产品价值与核心卖点，支持中/英/日切换（next-intl），显著 CTA（开始使用）。
   - 认证：Supabase Auth（邮箱/密码 + Google 登录）。
2) 单文件上传
   - 仅单文件上传；类型白名单：JPG/JPEG/BMP/PNG/PDF；大小 ≤ 20MB。
   - 前端直传 Supabase Storage 私有桶，生成短时效签名 URL；写入报告元数据与状态。
3) 异步解析与 AI 分析（不使用任何 OCR/转译工具）
   - 解析（抽取）：后端将文件签名 URL 或二进制片段直接传给多模态模型（OpenRouter·ChatGPT‑4o 或同级），要求输出“标准化 JSON”。
   - 归一化：对不同语言、别名、单位做统一映射与换算；生成可用于趋势分析的结构化记录。
   - 分析：基于“本次标准化 JSON + 历史同用户同指标序列”，由 AI 生成健康建议（含免责声明）。
   - 全流程异步，上传后用户无需停留等待。
4) 报告详情
   - 报告详情：原文件预览（签名 URL）、结构化指标表（按类别分组）、AI 建议。
5) 历史与趋势
   - 我的报告：按日期/状态基础筛选与分页；进入详情页查看内容。
   - 趋势分析：聚焦三大类指标——血糖（GLU/FPG）、血脂（TC/TG/LDL/HDL）、血压（收缩/舒张）；`Recharts` 折线/柱状，支持 30/90 天/年度/自定义时间范围。
6) 设置（最小化）
   - 多语言切换（中/英/日）；退出登录。其他偏好后置。

不在 MVP：管理员后台及任何个人明细查看通道；PDF 导出；多文件批量上传；第三方健康平台同步；复杂通知策略与配额/付费；运营报表与水印式 PDF。

## 三、用户与关键场景
- 角色：
  - 访客：了解价值 → 注册/登录。
  - 已登录用户：上传 → 异步解析 → 归一化入库 → AI 分析 → 查看详情 → 历史与趋势。
- 典型旅程：
  1. 主页 → 注册/登录（邮箱/密码或 Google）→ Dashboard 概览。
  2. 上传体检报告（单文件，白名单校验通过）→ 立即显示“排队/抽取中”，可离开页面。
  3. 后端异步：文件 → 多模态模型抽取 JSON → 归一化与入库 → 触发 AI 分析 → 状态更新为“已完成”。
  4. 打开报告详情：原文预览 + “结构化指标表” + “AI 建议”。
  5. 历史与趋势：列表按日期/状态筛选；趋势聚焦血糖/血脂/血压。

## 四、数据标准与 JSON 规范
- 参考样例：`health_report_test.json`（根目录）。
- 存储双轨（必须）：
  - normalized（用于计算/趋势）：统一名称、单位、区间、flag；可检索与聚合。
  - original（原始结构快照）：保留上传报告被模型识别出的原始分组/字段，便于追溯（强制存储）。
- normalized.item 字段要求：
  - `canonical_key`：统一键（例：`blood_glucose.fpg`、`blood_lipids.ldl_c`、`blood_pressure.systolic`）。
  - `display_name`、`original_names[]`：当前语言展示名、原文/别名集合（含中/英/日）。
  - `category`：`blood_glucose | blood_lipids | blood_pressure | cbc | liver | renal | urine | general`。
  - `value`（数值）、`unit`（统一单位）、`original_value_text`、`original_unit`。
  - 参考区间：`ref_low`、`ref_high`、`ref_unit`、`original_ref_text`。
  - `flag`：`low|normal|high|unknown`（依据区间判定）。
  - `confidence`（0–1）、`page_ref`、`notes`（可选）。
- 单位归一（常见项）：
  - 血糖：mmol/L（mg/dL × 0.0555）
  - 总胆固醇/LDL/HDL：mmol/L（mg/dL × 0.0259）
  - 甘油三酯：mmol/L（mg/dL × 0.0113）
  - 血压：mmHg（kPa × 7.5006）
  - 肌酐：µmol/L（mg/dL × 88.4）
  - 血红蛋白：g/L（g/dL × 10）
- 别名与多语言映射：
  - 通过 `test_catalog` 字典维护 `canonical_key ↔ 同义词/缩写（zh/en/ja）`（如 GLU、HbA1c、SBP/DBP、TC/TG/LDL/HDL、ALT/AST、Scr/UA）。
  - 模型抽取阶段尽量直接输出 `canonical_key`；若缺失，由归一化服务按字典回填。

## 五、异步流程与状态机
- 上传后状态机：
  - `uploaded` → `queued_extraction` → `extracting` → `queued_analysis` → `analyzing` → `completed`
  - 失败分支：`extraction_failed`、`analysis_failed`（支持重试）。
- 关键约束：
  - 严禁使用任何 OCR 或 PDF 转文字/转图片工具；仅通过多模态模型直接读取图片/PDF。
  - 若模型不接受 URL：后端以二进制片段方式传入（仍不做 OCR）。
  - 上传后 ≤ 3 秒进入队列；P50 解析完成 ≈ 20s，P95 ≤ 60s（以环境为准）。

## 六、信息架构与页面
- 主页 `/`
- 认证 `/auth/login`、`/auth/register`
- Dashboard（用户）
  - 概览 `/dashboard`
  - 上传 `/dashboard/upload`
  - 我的报告 `/dashboard/reports`
  - 报告详情 `/dashboard/reports/[reportId]`
  - 趋势分析 `/dashboard/analytics`
  - 设置 `/dashboard/settings`

## 七、非功能与安全
- 性能：LCP < 2.5s；上传→“待校对/分析中”反馈≤3s；P95 端到端 ≤ 60s。
- 安全与隐私：
  - Supabase RLS（按 `user_id`）与 Storage 私有桶 + 短时效签名 URL。
  - 管理员相关功能不在 MVP；无个人明细访问通道。
  - 环境变量管理 OpenRouter APIKey、数据库连接等敏感配置。

## 八、验收标准（MVP 精简版）
1) 认证与多语言：邮箱/Google 登录成功；中/英/日文本切换正确。
2) 上传与校验：白名单类型与 ≤20MB 校验准确；≥95% 合规文件进入解析。
3) 解析输出：在无 OCR/转译前提下，模型输出“标准化 JSON”，解析失败率 < 10%，失败可重试。
4) 归一化入库：名称/单位/区间归一正确；`flag` 判定符合区间；历史聚合可用。
5) AI 建议：AI 建议 ≤15s 可用（P95 ≤60s），内容可读、含免责声明。
6) 历史与趋势：列表筛选正确；趋势默认显示血糖/血脂/血压时间序列，切换时段生效。
7) 隐私与安全：用户仅能访问本人数据；管理员功能缺省；越权尝试被阻断并记录。

## 九、里程碑（建议）
- M0：PRD 对齐与样例/字典准备
- M1：数据模型/鉴权/上传/异步管线雏形
- M2：报告详情/AI 建议
- M3：趋势分析/多语言与可访问性
- M4：验收与上线

## 十、后续与不在范围（MVP）
- 管理端、PDF 导出、批量上传、通知系统、第三方平台同步、运营报表、水印式 PDF、配额/付费等。

## 附：变更记录（Changelog）
- V0.3.1：按新结论调整——PDF 导出移出 MVP；明确 normalized + original 双轨“必须存储”。
- V0.3：精简 MVP，移除管理员功能；限定单文件上传；明确“无 OCR/转译，直接多模态抽取”；聚焦血糖/血脂/血压趋势；新增导出 PDF 要求与统一 JSON 规范。
