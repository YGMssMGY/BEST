export function getPageTitle(pageContext) {
    const title = pageContext.documentProps?.title || pageContext.pageProps?.title || "Best of Basis Magazine"
    return title
}
