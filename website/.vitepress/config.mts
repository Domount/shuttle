import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Shuttle",
  description: "Local agentic app framework — Express + agent backend + React",
  base: "/shuttle/",
  head: [["link", { rel: "icon", href: "/shuttle/favicon.svg" }]],
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API", link: "/api/" },
      { text: "GitHub", link: "https://github.com/Domount/shuttle" },
      { text: "Sponsor", link: "https://liberapay.com/domount/" },
      {
        text: "npm",
        link: "https://www.npmjs.com/package/@domount/shuttle",
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "Getting started", link: "/guide/getting-started" },
            { text: "Architecture", link: "/guide/architecture" },
            { text: "Agent protocol", link: "/guide/agent-protocol" },
            { text: "Extending", link: "/guide/extending" },
          ],
        },
      ],
      "/api/": [
        {
          text: "Packages",
          items: [{ text: "Exports", link: "/api/" }],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/Domount/shuttle" },
    ],
    editLink: {
      pattern: "https://github.com/Domount/shuttle/edit/master/website/:path",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Domount",
    },
  },
});
