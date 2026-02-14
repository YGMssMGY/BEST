import React, { useEffect, useRef, useState } from "react"
import "./TurnJsFlipbook.css"

const PAGE_RATIO = 2482 / 3544
const PAGE_COUNT = 31 // Based on the number of pages in public/pages/best/

export function TurnJsFlipbook() {
    const containerRef = useRef(null)
    const magazineRef = useRef(null)
    const [loadedCount, setLoadedCount] = useState(0)
    const [totalPages, setTotalPages] = useState(PAGE_COUNT)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Debug: add a marker to see if useEffect runs
        window._turnJsDebug = "useEffect ran"

        // Load jQuery and turn.js if not already loaded
        const loadScripts = () => {
            return new Promise((resolve, reject) => {
                if (window.jQuery && window.jQuery.fn && window.jQuery.fn.turn) {
                    resolve()
                    return
                }

                // Load jQuery
                if (!window.jQuery) {
                    const jqueryScript = document.createElement("script")
                    jqueryScript.src = "/jquery-3.7.1.min.js"
                    jqueryScript.onload = () => {
                        // Load turn.js after jQuery
                        const turnScript = document.createElement("script")
                        turnScript.src = "/turn.min.js"
                        turnScript.onload = resolve
                        turnScript.onerror = () => reject(new Error("Failed to load turn.js"))
                        document.head.appendChild(turnScript)
                    }
                    jqueryScript.onerror = () => reject(new Error("Failed to load jQuery"))
                    document.head.appendChild(jqueryScript)
                } else if (!window.jQuery.fn.turn) {
                    // jQuery loaded but not turn.js
                    const turnScript = document.createElement("script")
                    turnScript.src = "/turn.min.js"
                    turnScript.onload = resolve
                    turnScript.onerror = () => reject(new Error("Failed to load turn.js"))
                    document.head.appendChild(turnScript)
                } else {
                    resolve()
                }
            })
        }

        const initializeFlipbook = async () => {
            await loadScripts()

            const $ = window.jQuery
            const magazine = $(magazineRef.current)
            const container = containerRef.current
            const pages = magazine.find("div")

            setTotalPages(pages.length)

            // Preload page images
            pages.each(function (index) {
                const bg = $(this).data("bg")
                const img = new Image()
                img.src = bg
                img.onload = () => {
                    $(this).css("background-image", `url(${bg})`)
                    setLoadedCount(prev => prev + 1)
                }
            })

            // Initialize turn.js
            magazine.turn({
                display: "single",
                acceleration: true,
                gradients: !$.isTouch,
                elevation: 50
            })

            // Handle resize
            const resizeMagazine = () => {
                if (!container) return

                const w = container.clientWidth
                const h = container.clientHeight
                const isPortrait = window.matchMedia("(orientation: portrait)").matches
                const displayMode = isPortrait ? "single" : "double"

                magazine.turn("display", displayMode)

                const pageCount = displayMode === "double" ? 2 : 1
                let width = w
                let height = width / (PAGE_RATIO * pageCount)

                if (height > h) {
                    height = h
                    width = height * PAGE_RATIO * pageCount
                }

                magazine.turn("size", Math.floor(width), Math.floor(height))
            }

            // Initial resize
            resizeMagazine()
            window.addEventListener("resize", resizeMagazine)

            // Navigation buttons
            $("#prevBtn").click(() => magazine.turn("previous"))
            $("#nextBtn").click(() => magazine.turn("next"))

            return () => {
                window.removeEventListener("resize", resizeMagazine)
                if (magazine.data("turn")) {
                    magazine.turn("destroy")
                }
            }
        }

        initializeFlipbook().catch(err => {
            console.error("Failed to initialize flipbook:", err)
            // Re-throw to make error visible
            setTimeout(() => {
                throw err
            }, 0)
            // Still hide loading after a delay
            setTimeout(() => {
                setIsLoading(false)
            }, 3000)
        })

        // Cleanup function
        return () => {
            if (window.jQuery && magazineRef.current) {
                const $ = window.jQuery
                const magazine = $(magazineRef.current)
                if (magazine.data("turn")) {
                    magazine.turn("destroy")
                }
            }
        }
    }, [])

    // Check if all images are loaded
    useEffect(() => {
        console.log(`[TurnJsFlipbook] loadedCount: ${loadedCount}, totalPages: ${totalPages}`)
        if (loadedCount === totalPages && totalPages > 0) {
            console.log("[TurnJsFlipbook] All images loaded, hiding loading screen")
            setIsLoading(false)
        }

        // Safety timeout: hide loading after 10 seconds max
        const timeoutId = setTimeout(() => {
            console.log("[TurnJsFlipbook] Safety timeout reached, hiding loading screen")
            setIsLoading(false)
        }, 10000)

        return () => {
            console.log("[TurnJsFlipbook] Cleaning up timeout")
            clearTimeout(timeoutId)
        }
    }, [loadedCount, totalPages])

    // Generate page divs
    const pageDivs = []
    for (let i = 1; i <= PAGE_COUNT; i++) {
        const pageNum = i.toString().padStart(2, "0")
        pageDivs.push(<div key={i} data-bg={`/pages/best/${pageNum}.jpg`} className="turn-page" />)
    }

    const progressPercentage = totalPages > 0 ? (loadedCount / totalPages) * 100 : 0

    return (
        <div className="turnjs-flipbook">
            {/* Loading Screen */}
            {isLoading && (
                <div id="loading-screen">
                    <div className="loader"></div>
                    <div className="loading-text">Loading...</div>
                    <progress id="progress-bar" value={progressPercentage} max="100"></progress>
                    <p id="progress-label">{Math.round(progressPercentage)}%</p>
                    <p id="loading-log">
                        Loaded {loadedCount} of {totalPages}
                    </p>
                </div>
            )}

            {/* Flipbook Container */}
            <div id="mag-container" ref={containerRef}>
                <button id="prevBtn" className="nav-btn">
                    ❮
                </button>
                <div id="magazine" ref={magazineRef}>
                    {pageDivs}
                </div>
                <button id="nextBtn" className="nav-btn">
                    ❯
                </button>
            </div>
        </div>
    )
}
