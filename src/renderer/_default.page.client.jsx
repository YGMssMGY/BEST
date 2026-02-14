import React from "react"
import ReactDOM from "react-dom/client"
import { PageShell } from "./PageShell"
import { getPageTitle } from "./getPageTitle"

export { render }

async function render(pageContext) {
    const { Page, pageProps } = pageContext
    const page = (
        <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
        </PageShell>
    )

    const container = document.getElementById("page-view")
    if (!container) {
        throw new Error("DOM element #page-view not found")
    }

    const root = ReactDOM.createRoot(container)
    root.render(page)

    // Update page title
    document.title = getPageTitle(pageContext)
}

export const clientRouting = true
