"use client";

import { useState, useRef } from "react";
import styles from "./page.module.css";

const EMOJIS = ["📚", "🔤", "✨", "🌟", "🎉", "💡", "🦋", "🌈"];

function FloatingEmoji({ emoji, style }) {
  return (
    <span className={styles.floatingEmoji} style={style} aria-hidden="true">
      {emoji}
    </span>
  );
}

function Spinner() {
  return <div className={styles.spinner} aria-label="Loading..." />;
}

function Badge({ text }) {
  return <span className={styles.badge}>{text}</span>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function handleSearch(e) {
    e.preventDefault();
    const word = query.trim();
    if (!word) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setQuery("");
    setResult(null);
    setError(null);
    inputRef.current?.focus();
  }

  return (
    <main className={styles.main}>
      {/* Decorative floating emojis */}
      <FloatingEmoji emoji="📚" style={{ top: "6%", left: "4%", animationDelay: "0s" }} />
      <FloatingEmoji emoji="🌟" style={{ top: "12%", right: "6%", animationDelay: "0.5s" }} />
      <FloatingEmoji emoji="🦋" style={{ bottom: "18%", left: "7%", animationDelay: "1s" }} />
      <FloatingEmoji emoji="🎉" style={{ bottom: "10%", right: "4%", animationDelay: "1.5s" }} />
      <FloatingEmoji emoji="🌈" style={{ top: "40%", left: "2%", animationDelay: "0.8s" }} />
      <FloatingEmoji emoji="✨" style={{ top: "55%", right: "3%", animationDelay: "0.3s" }} />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo} aria-hidden="true">🔤</div>
          <h1 className={styles.title}>WordWiz</h1>
          <p className={styles.subtitle}>Your magical dictionary for curious minds!</p>
        </header>

        {/* Search form */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a word to discover..."
              className={styles.input}
              maxLength={50}
              autoComplete="off"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className={styles.clearBtn}
                aria-label="Clear"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={styles.searchBtn}
          >
            {loading ? <Spinner /> : "Look it up! ✨"}
          </button>
        </form>

        {/* Error state */}
        {error && (
          <div className={styles.errorCard} role="alert">
            <span>😅</span> {error}
          </div>
        )}

        {/* Result card */}
        {result && !error && (
          <div className={styles.resultCard} role="region" aria-label="Definition result">
            {/* Word + part of speech */}
            <div className={styles.wordRow}>
              <h2 className={styles.wordTitle}>{result.word}</h2>
              {result.partOfSpeech && <Badge text={result.partOfSpeech} />}
            </div>

            {/* Definition */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span>💡</span> What it means
              </div>
              <p className={styles.definition}>{result.definition}</p>
            </div>

            {/* Examples */}
            {result.examples?.length > 0 && result.examples[0] && (
              <div className={styles.section}>
                <div className={styles.sectionLabel}>
                  <span>📝</span> Example sentences
                </div>
                <ul className={styles.exampleList}>
                  {result.examples.filter(Boolean).map((ex, i) => (
                    <li key={i} className={styles.exampleItem}>
                      <span className={styles.exampleBullet}>{i + 1}</span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fun fact */}
            {result.funFact && (
              <div className={styles.funFact}>
                <span>🌟 </span>
                <strong>Fun fact: </strong>
                {result.funFact}
              </div>
            )}
          </div>
        )}

        {/* Idle state hint */}
        {!result && !loading && !error && (
          <div className={styles.hint}>
            <p>Try a word like <em>volcano</em>, <em>curious</em>, or <em>hibernate</em>!</p>
          </div>
        )}
      </div>
    </main>
  );
}
