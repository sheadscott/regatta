// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.TINA_BRANCH ?? process.env.VERCEL_GIT_COMMIT_REF ?? "main",
  clientId: process.env.TINA_CLIENT_ID ?? null,
  token: process.env.TINA_TOKEN ?? null,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "portfolio",
        label: "Portfolio Items",
        path: "src/content/portfolio",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: ["Recreational", "Medical", "Oil & Gas", "Consumer", "Automotive"]
          },
          { type: "boolean", name: "featured", label: "Featured (pins to top of grid)" },
          { type: "datetime", name: "date", label: "Date", required: true },
          { type: "image", name: "images", label: "Images", list: true },
          { type: "rich-text", name: "body", label: "Description", isBody: true }
        ]
      },
      {
        name: "team",
        label: "Team Members",
        path: "src/content/team",
        format: "json",
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "string", name: "role", label: "Role / Title", required: true },
          { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
          { type: "image", name: "photo", label: "Photo", required: true },
          { type: "number", name: "order", label: "Display Order (lower = earlier)", required: true }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
