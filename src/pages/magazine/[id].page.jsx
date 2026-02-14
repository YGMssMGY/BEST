import React from "react"
import { TurnJsFlipbook } from "../../components/TurnJsFlipbook/TurnJsFlipbook"
import "../../magazine.css"

export function Page(pageProps) {
    const { id } = pageProps.routeParams || { id: "best" }

    return (
        <div className="magazine-view-page">
            <TurnJsFlipbook />
        </div>
    )
}

export function onBeforeRender(pageContext) {
    const { id } = pageContext.routeParams || { id: "best" }
    return {
        pageContext: {
            // Pass routeParams to pageProps so Page component can access them
            pageProps: {
                routeParams: { id }
            },
            documentProps: {
                title: `Best of Basis Magazine - ${id}`,
                description: `Explore the ${id} edition of Best of Basis Magazine — a digital flipbook experience featuring top articles, visuals, and stories from BASIS students and creators.`
            }
        }
    }
}
