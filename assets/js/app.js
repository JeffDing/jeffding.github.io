/* =========================================================
   Jeff Ding · Personal Site
   ========================================================= */

(function () {
  "use strict";

  var BLOG_DIR = "content/blog/";
  var MANIFEST_URL = "blog-manifest.json";
  var ABOUT_URL = "content/about.md";
  var WORKS_URL = "content/works.md";
  var CERT_MANIFEST_URL = "certificates-manifest.json";
  var cache = { manifest: null };

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function postUrl(slug) {
    return "post.html?slug=" + encodeURIComponent(slug);
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = String(iso).split("-");
    if (parts.length !== 3) return iso;
    return parts[0] + "." + parts[1] + "." + parts[2];
  }

  function formatDateLong(iso) {
    if (!iso) return "";
    var parts = String(iso).split("-");
    if (parts.length !== 3) return iso;
    return parts[0] + " 年 " + Number(parts[1]) + " 月 " + Number(parts[2]) + " 日";
  }

  /* ---------- theme ---------- */

  function initTheme() {
    var btn = $("#theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#040405" : "#0b0b0c");
    });
  }

  /* ---------- nav / header ---------- */

  function initChrome() {
    var header = $("#site-header");
    var toggle = $("#nav-toggle");
    var nav = $("#site-nav");

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    var year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    var reveals = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- data ---------- */

  function loadManifest() {
    if (cache.manifest) return Promise.resolve(cache.manifest);
    return fetch(MANIFEST_URL, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("manifest " + res.status);
        return res.json();
      })
      .then(function (data) {
        var posts = (data.posts || []).slice().sort(function (a, b) {
          return String(b.date || "").localeCompare(String(a.date || ""));
        });
        cache.manifest = posts;
        return posts;
      });
  }

  function loadText(url) {
    return fetch(encodeURI(url), { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error(url + " " + res.status);
      return res.text();
    });
  }

  function stripFrontmatter(md) {
    var m = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/.exec(md);
    return m ? md.slice(m[0].length) : md;
  }

  /* ---------- markdown ---------- */

  function renderMarkdown(md) {
    var html = marked.parse(stripFrontmatter(md), {
      gfm: true,
      breaks: false,
      headerIds: false,
      mangle: false
    });
    var wrap = document.createElement("div");
    wrap.innerHTML = html;

    wrap.querySelectorAll("img").forEach(function (img) {
      var src = img.getAttribute("src") || "";
      if (src && !/^(https?:)?\/\//i.test(src) && src.charAt(0) !== "/" && src.indexOf("data:") !== 0) {
        img.setAttribute("src", BLOG_DIR + src.replace(/^\.\//, ""));
      }
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
    });

    wrap.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });

    wrap.querySelectorAll("pre code").forEach(function (code) {
      try {
        hljs.highlightElement(code);
      } catch (e) {}
    });

    wrap.querySelectorAll("pre").forEach(function (pre) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "复制";
      btn.addEventListener("click", function () {
        var text = pre.querySelector("code");
        text = text ? text.innerText : pre.innerText;
        var done = function () {
          btn.textContent = "已复制";
          btn.classList.add("is-done");
          setTimeout(function () {
            btn.textContent = "复制";
            btn.classList.remove("is-done");
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {});
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
            done();
          } catch (e) {}
          document.body.removeChild(ta);
        }
      });
      pre.appendChild(btn);
    });

    return wrap;
  }

  function renderInto(el, md) {
    var content = renderMarkdown(md);
    el.innerHTML = "";
    while (content.firstChild) el.appendChild(content.firstChild);
  }

  function errorBox(el, message) {
    el.innerHTML =
      '<p class="error-msg">' + esc(message) + "<br>请检查 <code>content/blog/</code> 目录，并运行 <code>python3 scripts/build_manifest.py</code> 重新生成文章索引。</p>";
  }

  /* ---------- post cards ---------- */

  function cardHtml(post) {
    var meta = [];
    if (post.date) meta.push(formatDate(post.date));
    return (
      '<a class="post-card" href="' + postUrl(post.slug) + '">' +
      '<div class="post-card-main">' +
      '<time datetime="' + esc(post.date || "") + '">' + esc(formatDate(post.date)) + "</time>" +
      "<h3>" + esc(post.title) + "</h3>" +
      (post.summary ? "<p>" + esc(post.summary) + "</p>" : "") +
      "</div>" +
      '<div class="post-side">' +
      (post.readingTime ? '<span class="read-time">' + post.readingTime + " 分钟</span>" : "") +
      '<span class="arrow" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
      "</span>" +
      "</div>" +
      "</a>"
    );
  }

  function fillList(el, posts) {
    if (!posts.length) {
      el.innerHTML = '<p class="list-empty">暂无博客</p>';
      return;
    }
    el.innerHTML = posts.map(cardHtml).join("");
  }

  /* ---------- pages ---------- */

  function initHome() {
    var aboutEl = $("#about-content");
    if (aboutEl) {
      loadText(ABOUT_URL)
        .then(function (md) {
          renderInto(aboutEl, md);
        })
        .catch(function () {
          aboutEl.innerHTML =
            '<p class="error-msg">找不到个人介绍文件 <code>content/about.md</code>，创建一个 Markdown 文件即可自动显示在这里。</p>';
        });
    }

    var listEl = $("#latest-posts");
    if (listEl) {
      loadManifest()
        .then(function (posts) {
          fillList(listEl, posts.slice(0, 4));
        })
        .catch(function () {
          errorBox(listEl, "文章索引加载失败。");
        });
    }

    var worksEl = $("#home-works");
    if (worksEl) initWorks(worksEl);
  }

  function initBlog() {
    var listEl = $("#post-list");
    var countEl = $("#list-count");
    var input = $("#search-input");
    if (!listEl) return;

    loadManifest()
      .then(function (posts) {
        var render = function (keyword) {
          var kw = keyword.trim().toLowerCase();
          var filtered = kw
            ? posts.filter(function (p) {
                return (
                  String(p.title).toLowerCase().indexOf(kw) > -1 ||
                  String(p.summary || "").toLowerCase().indexOf(kw) > -1
                );
              })
            : posts;
          fillList(listEl, filtered);
          if (countEl) {
            countEl.textContent = kw
              ? filtered.length + " / " + posts.length + " 篇"
              : posts.length + " 篇文章";
          }
        };

        render("");
        if (input) {
          var timer;
          input.addEventListener("input", function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
              render(input.value);
            }, 120);
          });
        }
      })
      .catch(function () {
        errorBox(listEl, "文章索引加载失败。");
        if (countEl) countEl.textContent = "";
      });
  }

  function initPost() {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug");
    var titleEl = $("#post-title");
    var metaEl = $("#post-meta");
    var bodyEl = $("#post-content");
    var navEl = $("#article-nav");
    var bar = $("#progress-bar");

    if (!slug) {
      titleEl.textContent = "没有找到这篇文章";
      bodyEl.innerHTML = '<p class="error-msg">缺少文章参数。请从 <a href="blog.html">博客列表</a> 进入。</p>';
      return;
    }

    titleEl.textContent = decodeURIComponent(slug);

    Promise.all([loadManifest(), loadText(BLOG_DIR + slug + ".md")])
      .then(function (results) {
        var posts = results[0];
        var md = results[1];
        var index = -1;
        for (var i = 0; i < posts.length; i++) {
          if (posts[i].slug === slug) {
            index = i;
            break;
          }
        }
        var post = index > -1 ? posts[index] : { title: slug, date: "" };

        titleEl.textContent = post.title;
        document.title = post.title + " · Jeff Ding";
        var desc = document.querySelector('meta[name="description"]');
        if (desc && post.summary) desc.setAttribute("content", post.summary);

        metaEl.innerHTML =
          (post.date ? "<span>" + esc(formatDateLong(post.date)) + "</span>" : "") +
          (post.readingTime ? "<span>约 " + post.readingTime + " 分钟阅读</span>" : "") +
          "<span>" + String(md.length) + " 字符</span>";

        renderInto(bodyEl, md);

        if (index > -1 && navEl) {
          var newer = index > 0 ? posts[index - 1] : null;
          var older = index < posts.length - 1 ? posts[index + 1] : null;
          var html = "";
          html += newer
            ? '<a href="' + postUrl(newer.slug) + '"><span class="dir">← 上一篇</span><span class="title">' + esc(newer.title) + "</span></a>"
            : '<span class="placeholder"></span>';
          html += older
            ? '<a class="next" href="' + postUrl(older.slug) + '"><span class="dir">下一篇 →</span><span class="title">' + esc(older.title) + "</span></a>"
            : '<span class="placeholder"></span>';
          navEl.innerHTML = html;
        }
      })
      .catch(function () {
        titleEl.textContent = decodeURIComponent(slug);
        bodyEl.innerHTML =
          '<p class="error-msg">文章 <code>' +
          esc(slug) +
          ".md</code> 加载失败。请确认它位于 <code>content/blog/</code> 目录中，并重新生成索引。</p>";
        metaEl.innerHTML = "";
      });

    if (bar) {
      var updateBar = function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
        bar.style.width = Math.min(100, Math.max(0, pct * 100)) + "%";
      };
      updateBar();
      window.addEventListener("scroll", updateBar, { passive: true });
      window.addEventListener("resize", updateBar);
    }
  }

  function initWorks(el) {
    var worksEl = el || $("#works-content");
    if (!worksEl) return;
    loadText(WORKS_URL)
      .then(function (md) {
        renderInto(worksEl, md);
      })
      .catch(function () {
        worksEl.innerHTML =
          '<p class="error-msg">找不到作品文件 <code>content/works.md</code>，创建一个 Markdown 文件即可自动显示在这里。</p>';
      });
  }

  function initCertificates() {
    var area = $("#cert-area");
    if (!area) return;

    var lightbox = $("#lightbox");
    var lbImg = $("#lightbox-img");
    var lbCap = $("#lightbox-caption");
    var lbClose = $("#lightbox-close");

    function openLightbox(src, name) {
      if (!lightbox || !lbImg) return;
      lbImg.setAttribute("src", src);
      lbImg.setAttribute("alt", name);
      if (lbCap) lbCap.textContent = name;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      if (lbImg) lbImg.setAttribute("src", "");
      document.body.style.overflow = "";
    }

    if (lightbox && lbClose) {
      lbClose.addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
          closeLightbox();
        }
      });
    }

    if (area) {
      area.addEventListener("click", function (e) {
        var card = e.target.closest(".cert-card");
        if (!card) return;
        openLightbox(card.getAttribute("data-src"), card.getAttribute("data-name"));
      });
    }

    function loadImageMeta(src) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = function () {
          resolve(null);
        };
        img.src = src;
      });
    }

    function renderCertCard(cert) {
      var name = esc(cert.name);
      var src = esc(cert.src);
      return (
        '<button type="button" class="cert-card" data-src="' +
        src +
        '" data-name="' +
        name +
        '">' +
        '<span class="cert-thumb">' +
        '<img src="' +
        src +
        '" alt="' +
        name +
        '" loading="lazy" decoding="async">' +
        "</span>" +
        '<span class="cert-name">' +
        name +
        "</span>" +
        "</button>"
      );
    }

    fetch(CERT_MANIFEST_URL, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("manifest " + res.status);
        return res.json();
      })
      .then(function (data) {
        var certs = (data.certificates || []).slice();
        if (!certs.length) {
          area.innerHTML =
            '<p class="cert-empty">还没有证书。把证书图片放进 <code>content/certificates/</code> 目录并推送，这里会自动平铺展示，名称取自文件名。</p>';
          return;
        }
        var cards = certs.map(renderCertCard);

        Promise.all(
          certs.map(function (cert, i) {
            return loadImageMeta(cert.src).then(function (meta) {
              return {
                index: i,
                landscape: meta ? meta.width >= meta.height : true,
              };
            });
          })
        )
          .then(function (items) {
            var landscape = [],
              portrait = [];
            items.forEach(function (item) {
              (item.landscape ? landscape : portrait).push(cards[item.index]);
            });
            area.innerHTML =
              (landscape.length
                ? '<div class="cert-grid" id="cert-grid-landscape"></div>'
                : "") +
              (portrait.length
                ? '<div class="cert-grid" id="cert-grid-portrait"></div>'
                : "");
            if (landscape.length) {
              $("#cert-grid-landscape").innerHTML = landscape.join("");
            }
            if (portrait.length) {
              $("#cert-grid-portrait").innerHTML = portrait.join("");
            }
          });
      })
      .catch(function () {
        area.innerHTML =
          '<p class="error-msg">证书索引加载失败。请运行 <code>python3 scripts/build_certificates_manifest.py</code> 重新生成 <code>certificates-manifest.json</code>。</p>';
      });
  }

  /* ---------- boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initChrome();
    var page = document.documentElement.dataset.page;
    if (page === "home") initHome();
    else if (page === "blog") initBlog();
    else if (page === "post") initPost();
    else if (page === "works") initWorks();
    else if (page === "certificates") initCertificates();
  });
})();
