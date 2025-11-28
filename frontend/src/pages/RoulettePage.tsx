import "./RoulettePage.css";

const ROULETTE_EMBED_PATH = "/roulette-app/index.html";

export default function RoulettePage() {
  return (
    <div className="roulette-page">
      <header className="roulette-page__header">
        <div>
          <p className="roulette-page__eyebrow">Marble Roulette</p>
          <h1>룰렛 실험실</h1>
        </div>
        <div className="roulette-page__meta">
          <span className="roulette-page__badge">MIT License</span>
          <a
            href="https://github.com/lazygyu/roulette"
            target="_blank"
            rel="noreferrer"
          >
            GitHub 원본 보기
          </a>
        </div>
      </header>

      <section className="roulette-page__viewer">
        <iframe
          title="Marble Roulette"
          src={ROULETTE_EMBED_PATH}
          loading="lazy"
          allowFullScreen
          className="roulette-page__iframe"
        />
      </section>

      <footer className="roulette-page__footer">
        <p>
          이 페이지는{" "}
          <a href="/licenses/roulette.txt" target="_blank" rel="noreferrer">
            lazygyu/roulette (MIT)
          </a>
          를 포함하고 있으며, 원본 라이선스를 준수합니다.
        </p>
      </footer>
    </div>
  );
}
