// Tell vite-plugin-ssr which pages to pre-render
// For dynamic routes, we can either:
// 1. Return specific URLs to pre-render
// 2. Return an empty array to skip pre-rendering for this route
export const prerender = async () => {
    // Pre-render specific magazine IDs
    return [
        {
            url: "/magazine/best",
            pageContext: {
                routeParams: { id: "best" }
            }
        }
    ]
}
