import React from "react"
import { Header } from "../components/Header/Header"
import "../style.css"

export function PageShell({ children, pageContext }) {
    // Check if we're on a magazine page
    const isMagazinePage = pageContext?.urlPathname?.startsWith("/magazine/")

    if (isMagazinePage) {
        // For magazine pages, don't use main tag or header
        // Just render children directly (the flipbook component handles its own layout)
        return <>{children}</>
    }

    // For non-magazine pages (Home, About), use the original layout with header and main
    return (
        <React.Fragment>
            <Header />
            <main>{children}</main>
        </React.Fragment>
    )
}
