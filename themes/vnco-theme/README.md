# VNCO Theme for Hugo (v0.146.0+) & Sveltia CMS

A production-ready, modular Hugo theme migrated from the `vnco-clean` vanilla HTML/CSS/JS site. Built strictly for **Hugo v0.146.0+** (`layouts/baseof.html`, `layouts/home.html`, `layouts/_partials/`, `layouts/_shortcodes/`) with full **Sveltia CMS** Git-backed content management.

## 1. How to Install the Theme in a Hugo Site

### Option A: Git Submodule (Recommended for Reusable Deployments)

From the root of your Hugo project:

```bash
git init
git submodule add https://github.com/vnco-logistics/vnco-theme.git themes/vnco-theme
```

Then copy the starter configuration and content from `themes/vnco-theme/exampleSite/` into your project root:

```bash
cp -r themes/vnco-theme/exampleSite/* .
```

Ensure your site's `hugo.yaml` references the theme:

```yaml
baseURL: "https://vncologistics.com/"
languageCode: "en-us"
title: "VNCO · Transport & Logistics"
theme: "vnco-theme"
```

### Option B: Hugo Modules

Initialize your site and mount the theme in `hugo.yaml`:

```yaml
module:
  imports:
    - path: github.com/vnco-logistics/vnco-theme
```

## 2. How to Configure Sveltia CMS (`static/admin/config.yml`)

1. Copy the theme's sample configuration into your site's `static/admin/` folder:
   ```bash
   mkdir -p static/admin static/images/uploads
   cp themes/vnco-theme/static/admin/config.yml.example static/admin/config.yml
   cp themes/vnco-theme/static/admin/index.html static/admin/index.html
   ```
2. Open `static/admin/config.yml` and update the `backend` block with your GitHub (or GitLab/Gitea) repository slug and default branch:
   ```yaml
   # yaml-language-server: $schema=https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json
   backend:
     name: github
     repo: your-org/your-hugo-repo
     branch: main

   media_folder: "static/images/uploads"
   public_folder: "/images/uploads"
   ```
3. **Key Sveltia Compatibility Guarantees**:
   - **YAML Front Matter Only**: All content files (`content/_index.md`, `content/contacto.md`, `content/landing-page.md`, `content/e-n.md`) use `---` YAML delimiters (`format: "yaml"`). TOML (`+++`) is completely avoided.
   - **Media Path Alignment**: Uploaded assets are stored in `static/images/uploads` and referenced in front matter as `/images/uploads/<filename>` because Hugo strips `static/` at build time.
   - **Zero Hard-Coded HTML**: Every headline, service card, about gallery item, and contact form input field is stored in structured YAML front matter so Sveltia editors can add, reorder, or edit content without touching template code.

## 3. How to Run the Site Locally (`hugo server`)

Verify that you have **Hugo Extended v0.146.0 or newer** installed:

```bash
hugo version
```

Start the local development server with live reload:

```bash
hugo server -D --disableFastRender
```

- **Live Website**: `http://localhost:1313/`
- **English Contact Page**: `http://localhost:1313/contacto/`
- **Spanish Landing Page**: `http://localhost:1313/landing-page/`
- **Spanish Contact Page**: `http://localhost:1313/e-n/`
- **Sveltia CMS Admin UI**: `http://localhost:1313/admin/` (Sveltia CMS supports local repository editing via the File System Access API in Chromium browsers when running on `localhost`).

To run a production build test locally:

```bash
hugo --gc --minify
```

## 4. How to Add a New Page via Sveltia CMS

1. Navigate to `/admin/` in your browser and sign in (or click **Work with Local Repository** during local development).
2. Select the **Site Pages (Folder Collection)** collection (`content/`).
3. Click **New Page** in the top-right toolbar.
4. Choose the desired **Page Type**:
   - **Home / Landing Page (`landing`)**: Enables the Hero, Services Cards, About Us Gallery, and Contact CTA sections.
   - **Contact Page (`contact`)**: Enables the Contact Header, Dynamic Form Fields builder, and Contact/Office Info panel.
   - **Standard Content Page (`standard`)**: Renders a clean branded header and Markdown body (supporting `{{</* callout */>}}` and `{{</* cta-button */>}}` shortcodes).
5. Fill in the **Page Title**, **Language Code** (`en` or `es`), and section fields, then click **Save** to commit the new `.md` file directly to `content/<slug>.md`.

## 5. Error Handling & Host Configuration (404 / 500)

- **404 Page (`layouts/404.html`)**: Hugo automatically compiles `layouts/404.html` into `public/404.html` at the site root. It uses the shared `layouts/baseof.html` shell via `{{ define "main" }}` so navigation and footer remain consistent.
- **Netlify Configuration (`netlify.toml`)**: Netlify automatically serves `public/404.html` for missing routes. An explicit `[[redirects]]` rule (`from = "/*"`, `to = "/404.html"`, `status = 404`) is also configured in `netlify.toml`. For 500-level server errors or custom edge error pages, configure Netlify Custom Error Pages or Cloudflare Pages `_redirects` at the CDN level, as Hugo is a static site generator whose primary built-in error template is `404.html`.
