# Jeff Ding · 个人主页

这是一个基于纯静态站点的个人主页，托管在 GitHub Pages。内容用 Markdown 维护，无需数据库与后端，推送后由 GitHub Actions 自动构建部署。

## 页面导航

| 页面 | 说明 |
| --- | --- |
| 首页 | 个人介绍、最新文章与作品概览 |
| 博客 | 技术文章列表，支持搜索 |
| 作品 | 开源项目、工具与文章合集 |
| 证书 | 认证与荣誉证书展示，平铺缩略图，点击查看大图 |

## 如何更新内容

### 1. 更新博客

博客文章是独立的 Markdown 文件，放在 `content/blog/` 目录下。

- **新增文章**：在 `content/blog/` 下新建 `.md` 文件，**文件名即为文章标题**（去掉 `.md` 后缀）。
- **可选 frontmatter**：在文件开头用 YAML 块声明日期与摘要，便于列表展示：

  ```markdown
  ---
  date: 2026-11-24
  summary: 这是一段文章摘要，会显示在博客列表中。
  ---

  正文内容……
  ```

  不写 frontmatter 也能正常发布，日期与摘要会自动推断。
- **生成索引**：运行 `python3 scripts/build_manifest.py` 生成 `blog-manifest.json`；推送到仓库后 GitHub Actions 也会自动生成，无需手动操作。
- **查看**：导航栏点击「博客」查看列表，点击标题进入正文。

### 2. 更新作品

作品内容集中在单个 Markdown 文件中：`content/works.md`。

- 直接用 Markdown 编辑该文件，支持标题、列表、链接、图片、代码块等。
- **查看**：导航栏点击「作品」查看完整内容，首页也会展示概览。

### 3. 更新证书

证书通过图片平铺展示，名称取自文件名，点击可查看大图。

- **添加证书**：把证书图片（`.jpg` / `.png` / `.svg` / `.webp` 等）放进 `content/certificates/` 目录。
- **名称**：证书名称自动取文件名（去掉扩展名），无需额外配置。
- **生成索引**：运行 `python3 scripts/build_certificates_manifest.py` 生成 `certificates-manifest.json`；推送到仓库后 GitHub Actions 会自动生成。
- **删除证书**：移除 `content/certificates/` 下对应的图片文件即可，重新生成索引后页面自动更新。
- **查看**：导航栏点击「证书」查看全部证书。

## 本地预览

在仓库根目录启动任意静态文件服务即可：

```bash
python3 -m http.server 3000
```

然后访问 `http://localhost:3000`。

## 部署

仓库已配置 GitHub Actions（`.github/workflows/deploy.yml`）：推送到 `master` / `main` 分支后，会自动生成博客与证书索引、提交并部署到 GitHub Pages。
