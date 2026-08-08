# 辰泰官网 Directus 初始化

本目录保存辰泰官网后台的可重复执行初始化脚本。第一批模型覆盖：

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
