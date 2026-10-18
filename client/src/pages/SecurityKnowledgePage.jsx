import { useState } from "react";
import securityKnowledge from "../data/SecurityKnowledge"
import "./SecurityKnowledgePage.css";

function SecurityKnowledgePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All",
        ...new Set(securityKnowledge.map((item) => item.category))
    ];

    const filteredKnowledge = securityKnowledge.filter((item) => {
        const matchesCategory =
            selectedCategory === "All" ||
            item.category === selectedCategory;

        const searchableText = [
            item.title,
            item.category,
            item.summary,
            item.whatHappened,
            item.whatItMeans,
            ...item.whySuspicious,
            ...item.attackerTechniques.map(
                (technique) => technique.name + " " + technique.description
            ),
            ...item.recommendedActions
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(
            searchTerm.trim().toLowerCase()
        );

        return matchesCategory && matchesSearch;
    });

    return (
        <main className="knowledge-page">

            <header className="knowledge-header">
                <div>
                    <div className="knowledge-eyebrow">
                        SENTINEL / SECURITY REFERENCE
                    </div>

                    <h1>Security Knowledge</h1>

                    <p>
                        Understand security events, recognize suspicious
                        patterns, and learn how to investigate them.
                    </p>
                </div>

                <div className="knowledge-total">
                    <span>{securityKnowledge.length}</span>
                    <small>Knowledge entries</small>
                </div>
            </header>

            <section className="knowledge-intro">
                <div className="knowledge-intro-icon">i</div>

                <div>
                    <h3>Understand before you investigate</h3>

                    <p>
                        A security event is not automatically an attack.
                        Use these guides to understand what the system
                        observed, why it might matter, and what to
                        investigate next.
                    </p>
                </div>
            </section>

            <section className="knowledge-controls">
                <div className="knowledge-search">
                    <span aria-hidden="true">⌕</span>

                    <input
                        type="search"
                        placeholder="Search security concepts, events, or actions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search security knowledge"
                    />

                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="knowledge-category-filter">
                    <label htmlFor="knowledge-category">
                        Category
                    </label>

                    <select
                        id="knowledge-category"
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <div className="knowledge-results">
                <span>
                    {filteredKnowledge.length}{" "}
                    {filteredKnowledge.length === 1
                        ? "entry"
                        : "entries"}
                </span>

                <span>
                    {selectedCategory === "All"
                        ? "All categories"
                        : selectedCategory}
                </span>
            </div>

            <section className="knowledge-grid">
                {filteredKnowledge.map((item) => (
                    <article
                        className="knowledge-card"
                        key={item.id}
                    >
                        <div className="knowledge-card-top">
                            <span className="knowledge-category">
                                {item.category}
                            </span>

                            <span
                                className={
                                    "knowledge-risk " +
                                    item.riskLevel
                                        .toLowerCase()
                                        .replaceAll(" ", "-")
                                }
                            >
                                {item.riskLevel}
                            </span>
                        </div>

                        <h2>{item.title}</h2>

                        <p className="knowledge-summary">
                            {item.summary}
                        </p>

                        <details className="knowledge-details">
                            <summary>
                                <span>Explore this topic</span>
                                <span
                                    className="knowledge-chevron"
                                    aria-hidden="true"
                                >
                                    +
                                </span>
                            </summary>

                            <div className="knowledge-detail-content">

                                <section>
                                    <h3>What happened?</h3>
                                    <p>{item.whatHappened}</p>
                                </section>

                                <section>
                                    <h3>What does it mean?</h3>
                                    <p>{item.whatItMeans}</p>
                                </section>

                                <section>
                                    <h3>Why might it be suspicious?</h3>

                                    <ul>
                                        {item.whySuspicious.map(
                                            (reason, index) => (
                                                <li key={index}>
                                                    {reason}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </section>

                                <section>
                                    <h3>Possible attacker techniques</h3>

                                    <div className="knowledge-techniques">
                                        {item.attackerTechniques.map(
                                            (technique) => (
                                                <div
                                                    className="knowledge-technique"
                                                    key={technique.name}
                                                >
                                                    <h4>
                                                        {technique.name}
                                                    </h4>

                                                    <p>
                                                        {technique.description}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h3>Recommended actions</h3>

                                    <ol>
                                        {item.recommendedActions.map(
                                            (action, index) => (
                                                <li key={index}>
                                                    {action}
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </section>

                                <section>
                                    <h3>Related events</h3>

                                    <div className="knowledge-event-tags">
                                        {item.relatedEvents.map(
                                            (event) => (
                                                <span key={event}>
                                                    {event}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </section>

                                <aside className="knowledge-note">
                                    <strong>Important note</strong>
                                    <p>{item.importantNote}</p>
                                </aside>

                            </div>
                        </details>
                    </article>
                ))}

                {filteredKnowledge.length === 0 && (
                    <div className="knowledge-empty">
                        <h3>No matching knowledge entries</h3>

                        <p>
                            Try another search term or select a
                            different category.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("All");
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>

            <footer className="knowledge-footer">
                Sentinel Security Knowledge
              
            </footer>

        </main>
    );
}

export default SecurityKnowledgePage;