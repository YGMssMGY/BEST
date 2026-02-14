import React from "react"
import ReactDOMServer from "react-dom/server"
import { PageShell } from "./PageShell"
import { getPageTitle } from "./getPageTitle"
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server"

export { render }
export { passToClient }

const passToClient = ["pageProps", "documentProps", "routeParams"]

async function render(pageContext) {
    const { Page, pageProps } = pageContext
    const page = (
        <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
        </PageShell>
    )

    const pageHtml = ReactDOMServer.renderToString(page)
    const title = getPageTitle(pageContext)

    const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#3255A4" />
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

    return {
        documentHtml,
        pageContext: {
            enableEagerStreaming: true
        }
    }
}
