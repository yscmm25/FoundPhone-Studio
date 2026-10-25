import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Phone } from "../Phone";
import { validateWork, type Work } from "../schema";
import "../styles.css";
import "./player.css";

function StoryPlayer() {
  const [work, setWork] = useState<Work | null>(null);
  const [error, setError] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    const abort = new AbortController();
    fetch(
      new URLSearchParams(location.search).get("preview") === "test"
        ? "./test-work.json"
        : new URLSearchParams(location.search).get("template") === "blank"
          ? "./blank-work.json"
          : "./work.json",
      { signal: abort.signal },
    )
      .then((r) => {
        if (!r.ok) throw Error("缺少作品文件，请运行 npm run story:build");
        return r.json();
      })
      .then((x) => {
        const parsed = validateWork(x);
        const savedName = localStorage.getItem(`foundphone-owner-${parsed.id}`)?.trim() || "";
        const nextWork: Work = {
          ...parsed,
          phone: {
            ...parsed.phone,
            passcode: "0111",
            owner: savedName || "",
          },
        };
        document.title =
          nextWork.title === "捡手机" ? "捡手机" : nextWork.title + " · 捡手机";
        setNameDraft(savedName);
        setWork(nextWork);
        setProfileReady(!!savedName);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e));
      });
    return () => abort.abort();
  }, []);

  const enterPhone = () => {
    const owner = nameDraft.trim();
    if (!owner || !work) return;
    try {
      localStorage.setItem(`foundphone-owner-${work.id}`, owner);
    } catch {
      // The current session can still continue if browser storage is unavailable.
    }
    setWork({ ...work, phone: { ...work.phone, owner } });
    setProfileReady(true);
  };

  if (!work) {
    return (
      <main className="story-runtime">
        <p role="status">{error || "正在打开手机…"}</p>
      </main>
    );
  }

  if (!profileReady) {
    return (
      <main
        className="story-runtime"
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          boxSizing: "border-box",
          padding: "28px",
          background: "#050505",
          color: "#f5f5f7",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            enterPhone();
          }}
          style={{ width: "min(100%, 340px)", textAlign: "center" }}
        >
          <div style={{ color: "#8e8e93", fontSize: "11px", letterSpacing: "0.28em", marginBottom: "18px" }}>
            FOUND PHONE · SETUP
          </div>
          <h1 style={{ fontSize: "29px", fontWeight: 500, letterSpacing: "0.04em", margin: "0 0 10px" }}>
            开启这部手机
          </h1>
          <p style={{ color: "#a1a1a6", fontSize: "14px", lineHeight: 1.7, margin: "0 0 34px" }}>
            请输入机主名称，开始探索手机里的内容。
          </p>
          <label htmlFor="owner-name" style={{ display: "block", textAlign: "left", fontSize: "12px", color: "#a1a1a6", marginBottom: "10px" }}>
            机主名称
          </label>
          <input
            id="owner-name"
            autoFocus
            maxLength={30}
            required
            value={nameDraft}
            onChange={(event) => setNameDraft(event.target.value)}
            placeholder="输入你想使用的名称"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px 14px",
              borderRadius: "13px",
              border: "1px solid #38383a",
              background: "#171719",
              color: "#f5f5f7",
              outline: "none",
              fontSize: "16px",
              marginBottom: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              border: 0,
              borderRadius: "13px",
              padding: "15px",
              background: "#f5f5f7",
              color: "#111",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            继续
          </button>
          <p style={{ color: "#636366", fontSize: "11px", marginTop: "18px" }}>
            名称保存在当前浏览器中，可在清除网站数据后重新设置。
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="story-runtime">
      <Phone work={work} />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StoryPlayer />);
