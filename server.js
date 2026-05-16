const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const nodemailer = require("nodemailer");

const root = __dirname;
const publicDir = path.join(root, "public");
const dataFile = path.join(root, "data", "site.json");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon"
};

function todayInShanghai() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function readSiteData() {
  return JSON.parse(await fs.readFile(dataFile, "utf8"));
}

async function writeSiteData(data) {
  await fs.writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`);
}

function mailEnabled() {
  return Boolean(process.env.SMTP_HOST && process.env.MAIL_TO);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendInquiryMail(inquiry) {
  if (!mailEnabled()) return { sent: false, reason: "SMTP_NOT_CONFIGURED" };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") !== "false",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || ""
        }
      : undefined
  });

  const rows = [
    ["姓名", inquiry.name],
    ["单位", inquiry.company],
    ["电话", inquiry.phone],
    ["邮箱", inquiry.email],
    ["行业", inquiry.industry],
    ["废气/溶剂", inquiry.medium],
    ["处理风量", inquiry.flowRate],
    ["资料说明", inquiry.attachmentNote],
    ["需求说明", inquiry.need],
    ["提交时间", inquiry.createdAt]
  ];

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER || "website@chentai.local",
    to: process.env.MAIL_TO,
    subject: `网站客户咨询表 - ${inquiry.name}`,
    text: rows.map(([label, value]) => `${label}: ${value || "-"}`).join("\n"),
    html: `
      <h2>网站客户咨询表</h2>
      <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;">
        ${rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value || "-")}</td></tr>`).join("")}
      </table>
    `
  });

  return { sent: true };
}

function safePublicPath(urlPath) {
  const normalized = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, normalized === "/" ? "index.html" : normalized);
  return filePath.startsWith(publicDir) ? filePath : null;
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/site") {
    send(res, 200, JSON.stringify(await readSiteData()));
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/inquiries") {
    const body = await readJsonBody(req);
    const data = await readSiteData();
    const inquiry = {
      id: `INQ-${Date.now()}`,
      name: String(body.name || "").trim(),
      company: String(body.company || "").trim(),
      phone: String(body.phone || body.contact || "").trim(),
      email: String(body.email || "").trim(),
      industry: String(body.industry || "").trim(),
      medium: String(body.medium || "").trim(),
      flowRate: String(body.flowRate || "").trim(),
      attachmentNote: String(body.attachmentNote || "").trim(),
      need: String(body.need || "").trim(),
      createdAt: new Date().toISOString()
    };

    if (!inquiry.name || !inquiry.phone || !inquiry.need) {
      send(res, 400, JSON.stringify({ error: "请填写姓名、电话和需求说明。" }));
      return true;
    }

    data.inquiries.unshift(inquiry);
    await writeSiteData(data);

    let mail = { sent: false, reason: "SMTP_NOT_CONFIGURED" };
    try {
      mail = await sendInquiryMail(inquiry);
    } catch (error) {
      console.error("Inquiry email failed:", error);
      mail = { sent: false, reason: "SMTP_SEND_FAILED" };
    }

    send(res, 201, JSON.stringify({ ok: true, inquiry, mail }));
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/news") {
    const body = await readJsonBody(req);
    const data = await readSiteData();
    const item = {
      id: `NEWS-${Date.now()}`,
      title: String(body.title || "").trim(),
      category: String(body.category || "动态").trim(),
      date: todayInShanghai(),
      summary: String(body.summary || "").trim()
    };

    if (!item.title || !item.summary) {
      send(res, 400, JSON.stringify({ error: "请填写标题和摘要。" }));
      return true;
    }

    data.news.unshift(item);
    await writeSiteData(data);
    send(res, 201, JSON.stringify({ ok: true, item }));
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/flow") {
    const body = await readJsonBody(req);
    const data = await readSiteData();
    if (!Array.isArray(body.steps) || body.steps.length < 2) {
      send(res, 400, JSON.stringify({ error: "流程图至少需要两个步骤。" }));
      return true;
    }

    const flow = {
      id: String(body.id || `flow-${Date.now()}`),
      title: String(body.title || "自定义流程").trim(),
      medium: String(body.medium || "有机尾气").trim(),
      type: String(body.type || "组合治理").trim(),
      pdfPreview: String(body.pdfPreview || "/assets/flows/三罐两级吸附流程图.pdf.png"),
      steps: body.steps.map((step) => String(step).trim()).filter(Boolean)
    };

    const index = data.flows.findIndex((item) => item.id === flow.id);
    if (index >= 0) data.flows[index] = flow;
    else data.flows.unshift(flow);

    await writeSiteData(data);
    send(res, 200, JSON.stringify({ ok: true, flow }));
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, url);
      if (!handled) send(res, 404, JSON.stringify({ error: "接口不存在。" }));
      return;
    }

    const filePath = safePublicPath(url.pathname);
    if (!filePath) {
      send(res, 403, "Forbidden", "text/plain; charset=utf-8");
      return;
    }

    const ext = path.extname(filePath);
    const content = await fs.readFile(filePath);
    send(res, 200, content, mime[ext] || "application/octet-stream");
  } catch (error) {
    if (error.code === "ENOENT") {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }
    console.error(error);
    send(res, 500, JSON.stringify({ error: "服务器内部错误。" }));
  }
});

server.listen(port, host, () => {
  console.log(`Chentai modern site running at http://${host}:${port}`);
});
