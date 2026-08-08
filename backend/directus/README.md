# 辰泰官网 Directus 初始化

本目录保存辰泰官网后台的可重复执行初始化脚本。当前模型覆盖：

- 全站公共设置、九个页面和可排序页面模块；
- 内容语言；
- 新闻、行业资讯、技术服务；
- 资质证书及展示位置；
- 客户留言、跟进备注和状态历史。

脚本只连接服务器本机的 `127.0.0.1:8055`，从 `/opt/chentai-cms/.env`
读取管理员账号，不输出密码和访问令牌。

## 执行前备份

```bash
cd /opt/chentai-cms
mkdir -p backups
docker compose exec -T database sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  | gzip > "backups/before-schema-$(date +%Y%m%d-%H%M%S).sql.gz"
ls -lh backups
```

## 执行

将 `bootstrap_core_schema.py` 上传至 `/opt/chentai-cms/` 后：

```bash
cd /opt/chentai-cms
chmod 700 bootstrap_core_schema.py
python3 bootstrap_core_schema.py
```

脚本可以重复执行；已经存在的集合和关系会显示为 `[skip]`。

## 角色与权限

核心数据模型验证完成后，将 `bootstrap_access.py` 上传到同一目录并执行：

```bash
cd /opt/chentai-cms
chmod 700 bootstrap_access.py
python3 bootstrap_access.py
```

脚本保留内置超级管理员，创建内容编辑、新闻编辑、留言客服和只读审阅
四个角色。它不会修改 Public 策略，并会在发现匿名留言权限时主动停止。

## 运营发布体验

角色权限验证完成后，运行 `bootstrap_editor_experience.py`：

```bash
cd /opt/chentai-cms
chmod 700 bootstrap_editor_experience.py
python3 bootstrap_editor_experience.py
```

脚本会把文章和证书翻译嵌入主编辑表单，配置封面、正文图片和证书图片
上传位置，隐藏运营人员不需要直接维护的技术集合与字段，并创建“辰泰官网素材”
文件夹树。脚本只更新 Directus 展示元数据和虚拟文件夹，不删除内容、不移动
已有文件，也不会修改 Public 策略。

## 简化的全站内容管理

运行 `bootstrap_site_content.py` 创建全站设置、页面管理和页面模块：

```bash
cd /opt/chentai-cms
chmod 700 bootstrap_site_content.py
python3 bootstrap_site_content.py
```

运营人员在后台日常只需要使用“网站内容”下的两个入口：

- **全站设置**：公司名称、定位语、简介、电话、邮箱、地址、Logo、微信二维码和页脚；
- **页面管理**：打开一个页面，在同一表单中编辑、隐藏和排序页面模块。

页面模块默认沿用官网现有排版，只替换标题、正文和图片；新增模块时才需要选择
“图片在左”“图片在右”“居中”“网格”或“通栏”。技术标识、页面定位和子集合
均隐藏，运营人员不需要理解数据库关系。脚本只补充缺少的默认页面和模块，不会覆盖
后台已经修改的内容，可以重复执行。

## 官网公开内容读取

全站内容模型和文章编辑体验均确认正常后，运行 `bootstrap_public_news.py`：

```bash
cd /opt/chentai-cms
chmod 700 bootstrap_public_news.py
python3 bootstrap_public_news.py
```

脚本允许官网匿名读取全站设置、页面模块、已发布文章、已校对翻译、启用的语言和
文章分类，以及“辰泰官网素材/新闻资讯”和“辰泰官网素材/全站内容”文件夹中的图片。
用户、客户留言、其他文件和所有写入操作保持私有。脚本发现相关集合已有匿名写权限
时会停止。

## 推荐执行顺序

```text
bootstrap_core_schema.py
→ bootstrap_access.py
→ bootstrap_editor_experience.py
→ bootstrap_site_content.py
→ bootstrap_public_news.py
```

前端通过同域的 `/cms-api/` 只读网关读取内容。Directus 暂时不可用时，页面会继续
显示打包在 HTML 中的原内容，不会出现整页空白。
