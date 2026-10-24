import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const publicRouteMetadata = {
  '/login': {
    title: 'Viswaas Matrimony Login | Sign In to Your Account',
    description: 'Sign in to Viswaas Matrimony to continue your search for a life partner and manage your matrimonial profile.',
  },
  '/subscription': {
    title: 'Assisted Matrimony Membership | Viswaas Matrimony',
    description: 'Learn about Viswaas Matrimony’s executive-assisted membership, including access to verified profiles and support from a relationship manager.',
  },
}

function prerenderPublicRouteMetadata() {
  return {
    name: 'prerender-public-route-metadata',
    apply: 'build',
    async writeBundle(outputOptions) {
      const outputDirectory = resolve(outputOptions.dir ?? 'dist')
      const homePage = await readFile(resolve(outputDirectory, 'index.html'), 'utf8')

      for (const [route, metadata] of Object.entries(publicRouteMetadata)) {
        const routePath = route.slice(1)
        const canonical = `https://viswaas.in${route}`
        const html = homePage
          .replace(/<title>[^<]*<\/title>/, `<title>${metadata.title}</title>`)
          .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${metadata.description}" />`)
          .replace(/<meta name="robots" content="[^"]*"\s*\/>/, '<meta name="robots" content="index, follow, max-image-preview:large" />')
          .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
          .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${metadata.title}" />`)
          .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${metadata.description}" />`)
          .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
          .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${metadata.title}" />`)
          .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${metadata.description}" />`)

        const routeDirectory = resolve(outputDirectory, routePath)
        await mkdir(routeDirectory, { recursive: true })
        await writeFile(resolve(routeDirectory, 'index.html'), html)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prerenderPublicRouteMetadata()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 5173,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5040',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
