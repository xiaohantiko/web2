# 辰泰官网留言接口

该服务监听服务器本机 `127.0.0.1:8060`，由 Nginx 的同源
`POST /api/inquiries` 入口调用。服务负责字段校验、蜜罐拦截、小时级限流，
并以独立的 Directus 最小权限身份新增 `inquiries` 记录。

`/opt/chentai-cms/inquiry-api.env` 只保存在服务器，权限应为 `0600`，不得提交
到 Git。对应身份没有后台登录、读取、修改或删除权限。
