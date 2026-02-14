import React from "react"

export function MagazineCard({ magazine }) {
    const { id, title, edition, coverImage } = magazine

    return (
        <div className="magazine-box">
            <a href={`/magazine/${id || "best"}`}>
                <img src={coverImage || "/covers/best.png"} alt={`${title} Cover`} />
                <div className="magazine-info">
                    <h2>{title || "Best of Basis Magazine Example"}</h2>
                    <p>{edition || "First Edition"}</p>
                </div>
            </a>
        </div>
    )
}
