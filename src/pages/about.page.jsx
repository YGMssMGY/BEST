import React from "react"

export function Page() {
    return (
        <React.Fragment>
            <section>
                <h1>About Us</h1>
                <p>
                    Welcome to our magazine project! We are a team of dedicated individuals passionate about bringing
                    you the best content through our magazines.
                </p>
                <p>
                    Our team consists of experienced writers, editors, designers, and developers who work tirelessly to
                    create engaging and informative magazines.
                </p>
            </section>
            <section>
                <h2>Our Team</h2>
                <ul>
                    <li>John Doe - Editor-in-Chief</li>
                    <li>Jane Smith - Senior Writer</li>
                    <li>Emily Johnson - Graphic Designer</li>
                    <li>Michael Brown - Web Developer</li>
                </ul>
            </section>
        </React.Fragment>
    )
}

export const documentProps = {
    title: "About Us | Best of Basis Magazine",
    description:
        "Learn more about the Best of Basis Magazine team — passionate students, writers, designers, and developers sharing creativity and insight."
}
