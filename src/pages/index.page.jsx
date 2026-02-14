import React from "react"
import { MagazineCard } from "../components/MagazineCard/MagazineCard"

export function Page() {
    // Sample magazine data - in a real app this would come from an API or data file
    const magazines = [
        {
            id: "best",
            title: "Best of Basis Magazine Example",
            edition: "First Edition",
            coverImage: "/covers/best.png"
        }
    ]

    return (
        <div className="home-page">
            <div className="magazine-grid">
                {magazines.map(magazine => (
                    <MagazineCard key={magazine.id} magazine={magazine} />
                ))}
            </div>
        </div>
    )
}

export const documentProps = {
    title: "View All Magazines | Best of Basis Magazine",
    description:
        "Browse all editions of the Best of Basis Magazine. Explore top stories, visuals, and student creativity in one place."
}
