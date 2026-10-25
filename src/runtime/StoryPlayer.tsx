import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Phone } from "../Phone";
import { ProfileSetup, type IdolProfile } from "./ProfileSetup";
import { validateWork, type Work } from "../schema";
import "../styles.css";
import "./player.css";
function StoryPlayer() {
  const [work, setWork] = useState<Work | null>(null),
    [profile, setProfile] = useState<IdolProfile | null>(null),
    [error, setError] = useState("");
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
        const w = validateWork(x);
        document.title =
          w.title === "捡手机" ? "捡手机" : w.title + " · 捡手机";
        setWork(w);
        try {
          const saved = localStorage.getItem("foundphone-idol-profile:" + w.id);
          if (saved) {
            const parsed = JSON.parse(saved) as IdolProfile;
            if (parsed.ownerName && parsed.stageName && parsed.passcode)
              setProfile(parsed);
          }
        } catch {
          localStorage.removeItem("foundphone-idol-profile:" + w.id);
        }
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e));
      });
    return () => abort.abort();
  }, []);
  return (
    <main className="story-runtime">
      {work ? (
        profile ? (
          <Phone
            work={{
              ...work,
              title: profile.stageName + " · 星光档案",
              phone: {
                ...work.phone,
                owner: profile.stageName,
                passcode: profile.passcode,
                theme: "dark",
                wallpaper: "black",
              },
              variables: {
                ...work.variables,
                player_owner_name: profile.ownerName,
                player_stage_name: profile.stageName,
                player_age: profile.age,
                player_support_color: profile.supportColor,
                player_avatar: profile.avatar || "",
                player_signature: profile.signature || "",
                player_device_name: profile.deviceName || "我的 iPhone",
              },
            }}
          />
        ) : (
          <ProfileSetup
            onComplete={(nextProfile) => {
              try {
                localStorage.setItem(
                  "foundphone-idol-profile:" + work.id,
                  JSON.stringify(nextProfile),
                );
              } catch {
                setError("无法保存档案，请检查浏览器存储空间或隐私设置。");
                return;
              }
              document.title = nextProfile.stageName + " · 星光档案";
              setProfile(nextProfile);
            }}
          />
        )
      ) : (
        <p role="status">{error || "正在打开手机…"}</p>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<StoryPlayer />);
