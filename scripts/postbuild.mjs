import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const index = await readFile(path.join(dist, "index.html"), "utf8");
const siteUrl = "https://reportfit.com/";
const tools = [
  {
    slug: "pdf-compress",
    title: "PDF 압축 - 레포트핏",
    description: "LMS 업로드 제한에 맞게 PDF 용량과 문서 정보를 브라우저에서 빠르게 정리하는 대학 과제 제출 도구입니다."
  },
  {
    slug: "pdf-edit",
    title: "PDF 편집 - 레포트핏",
    description: "여러 PDF 합치기, 페이지 범위 추출, PDF 회전을 과제 제출 전에 브라우저에서 처리합니다."
  },
  {
    slug: "pdf-number",
    title: "PDF 페이지 번호 넣기 - 레포트핏",
    description: "제출용 PDF 하단에 페이지 번호를 넣어 본문 순서와 누락 페이지를 더 쉽게 확인합니다."
  },
  {
    slug: "pdf-watermark",
    title: "PDF 워터마크 - 레포트핏",
    description: "초안, 참고자료, 개인 확인용 문구를 PDF에 은은하게 표시해 최종본과 구분합니다."
  },
  {
    slug: "image-convert",
    title: "이미지 변환 - 레포트핏",
    description: "JPG, PNG, WebP 이미지를 과제 제출에 맞게 변환하거나 여러 이미지를 PDF로 묶습니다."
  },
  {
    slug: "image-compress",
    title: "이미지 압축 - 레포트핏",
    description: "사진과 캡처 이미지 용량을 줄이고 여러 결과 파일을 ZIP으로 받아 과제 첨부를 가볍게 만듭니다."
  },
  {
    slug: "file-name",
    title: "과제 파일명 만들기 - 레포트핏",
    description: "과목명, 학번, 이름, 과제명을 조합해 제출용 파일명을 깔끔하게 생성합니다."
  },
  {
    slug: "submit-checklist",
    title: "과제 제출 전 점검표 - 레포트핏",
    description: "마감, 제출처, 파일명, 용량, 참고문헌, 첨부 여부를 과제 제출 직전에 복사 가능한 점검표로 정리합니다."
  },
  {
    slug: "submit-package",
    title: "과제 제출 패키지 만들기 - 레포트핏",
    description: "여러 제출 파일의 이름을 규칙에 맞게 정리하고 점검표와 함께 하나의 ZIP 파일로 묶습니다."
  },
  {
    slug: "word-count",
    title: "레포트 글자수 계산 - 레포트핏",
    description: "공백 포함, 공백 제외, 단어 수, A4 예상 분량을 빠르게 계산해 레포트 분량을 확인합니다."
  },
  {
    slug: "text-clean",
    title: "텍스트 정리 - 레포트핏",
    description: "PDF나 웹페이지에서 복사한 글의 줄바꿈, 중복 공백, 문단 간격을 제출용으로 정리합니다."
  },
  {
    slug: "table-convert",
    title: "표 변환 - 레포트핏",
    description: "엑셀이나 한글에서 복사한 표를 Markdown, CSV, HTML 형식으로 변환합니다."
  },
  {
    slug: "citation-cleaner",
    title: "참고문헌 정리 - 레포트핏",
    description: "참고문헌 줄을 만들고 정렬, 중복 제거, 누락 경고, 본문 인용까지 한 번에 정리합니다."
  },
  {
    slug: "file-check",
    title: "과제 파일 점검 - 레포트핏",
    description: "제출 파일의 용량, 확장자, 파일명, PDF 페이지 수를 제출 전에 확인합니다."
  },
  {
    slug: "zip-pack",
    title: "ZIP 압축 - 레포트핏",
    description: "과제 본문, 참고자료, 이미지 파일을 하나의 ZIP 파일로 묶어 제출 준비를 마무리합니다."
  },
  {
    slug: "privacy-clean",
    title: "개인정보 제거 - 레포트핏",
    description: "이미지 위치정보와 PDF 작성자 정보를 브라우저에서 다시 저장해 제출 전 개인정보 노출을 줄입니다."
  }
];
const pages = [
  {
    slug: "about",
    title: "레포트핏 소개",
    description: "레포트핏은 과제를 대신 작성하지 않고 제출 전 파일 변환과 문서 정리를 돕는 브라우저 기반 도구입니다."
  },
  {
    slug: "privacy",
    title: "개인정보 처리방침 - 레포트핏",
    description: "레포트핏의 파일 처리 기능과 개인정보 처리 기준을 안내합니다."
  },
  {
    slug: "terms",
    title: "이용안내 - 레포트핏",
    description: "레포트핏 사용 범위, 제출 전 확인 기준, 도구 결과의 한계를 안내합니다."
  },
  {
    slug: "contact",
    title: "문의 - 레포트핏",
    description: "레포트핏 오류, 기능 건의, 과제 제출 도구 개선 의견을 보내는 방법을 안내합니다."
  },
  {
    slug: "editorial",
    title: "편집 기준 - 레포트핏",
    description: "레포트핏이 과제 제출 전 파일과 형식 정리 도구를 구성하는 기준을 설명합니다."
  },
  {
    slug: "review-readiness",
    title: "승인 준비 체크 - 레포트핏",
    description: "레포트핏의 기능, 독립 페이지, 고유 설명 문서, 광고 심사 준비 기준을 정리합니다."
  }
];

const homeMeta = {
  title: "레포트핏 - 과제 제출용 PDF, 이미지, 파일 정리 도구",
  description: "레포트핏은 PDF 압축, 이미지 변환, 파일명 만들기, 글자수 계산, 참고문헌 정리, ZIP 압축을 브라우저에서 빠르게 처리하는 과제 제출 도구입니다.",
  route: "",
  kind: "home"
};

await writeFile(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: https://reportfit.com/sitemap.xml\n", "utf8");
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["", ...tools.map((tool) => `tools/${tool.slug}/`), ...pages.map((page) => `${page.slug}/`)]
    .map((loc) => `  <url><loc>https://reportfit.com/${loc}</loc><changefreq>${loc ? "monthly" : "weekly"}</changefreq></url>`)
    .join("\n")}\n</urlset>\n`,
  "utf8"
);

await writeFile(path.join(dist, "index.html"), withMeta(index, homeMeta), "utf8");

for (const tool of tools) {
  const dir = path.join(dist, "tools", tool.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), withMeta(index, { ...tool, route: `tools/${tool.slug}/`, kind: "tool" }), "utf8");
}

for (const page of pages) {
  const dir = path.join(dist, page.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), withMeta(index, { ...page, route: `${page.slug}/`, kind: "page" }), "utf8");
}

function withMeta(html, meta) {
  const url = `${siteUrl}${meta.route}`;
  const jsonLd = structuredData(meta, url);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n      ${JSON.stringify(jsonLd, null, 8)}\n    </script>`);
}

function structuredData(meta, url) {
  const name = cleanTitle(meta.title);
  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "레포트핏",
    url: siteUrl,
    inLanguage: "ko-KR"
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "레포트핏",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: url
      }
    ]
  };

  if (meta.kind === "home") return [site];

  if (meta.kind === "tool") {
    return [
      site,
      breadcrumb,
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        url,
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web",
        inLanguage: "ko-KR",
        description: meta.description,
        isPartOf: {
          "@type": "WebSite",
          name: "레포트핏",
          url: siteUrl
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `${name} 사용 방법`,
        description: meta.description,
        inLanguage: "ko-KR",
        step: [
          {
            "@type": "HowToStep",
            name: "입력값 준비",
            text: "도구 화면에서 과제 제출에 필요한 파일이나 입력값을 준비합니다."
          },
          {
            "@type": "HowToStep",
            name: "조건 확인",
            text: "마감, 용량, 확장자, 파일명처럼 제출처에서 요구하는 조건을 확인합니다."
          },
          {
            "@type": "HowToStep",
            name: "결과 확인",
            text: "처리 결과를 내려받거나 복사한 뒤 실제 제출 화면에서 다시 열어 확인합니다."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: "ko-KR",
        mainEntity: [
          {
            "@type": "Question",
            name: `${name}는 파일을 서버에 올리나요?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "레포트핏의 주요 파일 처리 기능은 사용자의 브라우저 안에서 실행되도록 구성되어 있습니다. 다만 최종 제출 전에는 결과 파일을 직접 열어 확인하는 것이 좋습니다."
            }
          },
          {
            "@type": "Question",
            name: "결과 파일을 바로 제출해도 되나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "도구 결과는 제출 전 정리를 돕는 보조 자료입니다. 과목별 제출 규정, 교수자 안내, 학교 LMS 제한을 마지막으로 확인한 뒤 제출해야 합니다."
            }
          }
        ]
      }
    ];
  }

  return [
    site,
    breadcrumb,
    {
      "@context": "https://schema.org",
      "@type": meta.kind === "home" ? "WebSite" : "WebPage",
      name,
      url,
      inLanguage: "ko-KR",
      description: meta.description,
      isPartOf: {
        "@type": "WebSite",
        name: "레포트핏",
        url: siteUrl
      }
    }
  ];
}

function cleanTitle(title) {
  return title.replace(" - 레포트핏", "").replace(/^레포트핏 - /, "레포트핏");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
