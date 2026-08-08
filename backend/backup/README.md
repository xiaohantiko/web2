# 辰泰网站自动备份

每天凌晨 03:20—03:30 之间执行，备份保存在服务器：

```text
/opt/chentai-backups/daily/YYYY-MM-DD_HHMMSS/
```

每个备份包含：

- `postgres.dump`：Directus/PostgreSQL 数据库，可用 `pg_restore` 恢复；
- `directus-files.tar.gz`：运营人员上传的图片、附件和 Directus 扩展；
- `configuration.tar.gz`：Docker、Nginx、HTTPS 证书和接口服务配置；
- `metadata.txt`：生成时间、服务器和当前网站发布版本；
- `SHA256SUMS`：完整性校验值。

脚本在生成过程中会检查数据库目录、压缩包和 SHA-256。只有全部检查通过，
才会更新 `/opt/chentai-backups/latest`。每日备份保留 14 天。

常用检查命令：

```bash
systemctl status chentai-backup.timer
systemctl list-timers chentai-backup.timer
sudo journalctl -u chentai-backup.service --no-pager
sudo sha256sum -c /opt/chentai-backups/latest/SHA256SUMS
sudo /usr/local/sbin/chentai-backup-verify
```

`chentai-backup-verify` 会把最新数据库备份恢复到一个临时数据库，核对核心表后
自动删除该测试数据库，不会修改生产数据库。

当前阶段是服务器本地备份。接入腾讯云 COS 后，应再增加异地同步，以覆盖整台
服务器磁盘故障这一类风险。

## 腾讯云 COS 异地备份

`chentai-backup-cos` 会把最新完整备份上传到私有 COS 存储桶，并启用 COS
服务端 AES256 加密。上传后会检查每个对象的大小，再下载 `SHA256SUMS` 与本地
副本对比。密钥只保存在服务器 `/etc/chentai-backup-cos.env`，权限为 `0600`。

建议给该服务使用独立 CAM 子用户，仅授予指定存储桶、指定前缀下的
`PutObject`、`HeadObject` 和 `GetObject` 权限。COS 生命周期规则负责保留 90 天。

本地备份成功后，systemd 会通过 `OnSuccess` 自动触发
`chentai-backup-cos.service`；COS 暂时不可用不会影响本地备份结果。
