# 辰泰网站运行健康巡检

`chentai-health-check` 每五分钟检查一次：

- Nginx 和官网首页；
- Directus 健康接口；
- 留言接口；
- PostgreSQL、Directus 容器状态；
- 系统盘使用率，默认告警线为 85%；
- 最新本地备份的完整性与时间，默认不得超过 36 小时。
- 主站 HTTPS 证书有效期，剩余不足 30 天时报告异常。

巡检只读取状态，不会重启服务、修改数据或访问公网。失败项会写入 systemd 日志，
并以非零状态结束，便于后续接入企业微信、短信或邮件告警。

常用命令：

```bash
systemctl status chentai-health-check.timer
systemctl list-timers chentai-health-check.timer
sudo systemctl start chentai-health-check.service
sudo journalctl -u chentai-health-check.service --no-pager -n 100
```

可通过 systemd service 的环境变量覆盖阈值：

```text
CHENTAI_MAX_DISK_PERCENT=85
CHENTAI_MAX_BACKUP_AGE_SECONDS=129600
CHENTAI_TLS_MIN_VALID_SECONDS=2592000
```
