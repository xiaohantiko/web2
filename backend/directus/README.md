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
