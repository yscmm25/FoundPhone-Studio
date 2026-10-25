import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Delete, LockKeyhole, Sparkles } from "lucide-react";
import "./profile-setup.css";

export type IdolProfile = {
  ownerName: string;
  stageName: string;
  age: number;
  supportColor: string;
  passcode: string;
};

const colors = [
  { name: "月光银", value: "#c8c9d2" },
  { name: "雾霭蓝", value: "#8da9d6" },
  { name: "樱花粉", value: "#f0a8c4" },
  { name: "薄荷绿", value: "#91d6bd" },
  { name: "香槟金", value: "#d9bd83" },
  { name: "深海紫", value: "#a99adf" },
];

type Step = "profile" | "passcode" | "confirm";

export function ProfileSetup({ onComplete }: { onComplete: (profile: IdolProfile) => void }) {
  const [step, setStep] = useState<Step>("profile");
  const [ownerName, setOwnerName] = useState("");
  const [stageName, setStageName] = useState("");
  const [age, setAge] = useState("20");
  const [supportColor, setSupportColor] = useState(colors[0].value);
  const [passcode, setPasscode] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function submitProfile(event: FormEvent) {
    event.preventDefault();
    if (!ownerName.trim() || !stageName.trim()) {
      setError("请填写机主姓名与艺名。");
      return;
    }
    setError("");
    setStep("passcode");
  }

  function enterDigit(digit: string) {
    setError("");
    const current = step === "passcode" ? passcode : confirm;
    const setCurrent = step === "passcode" ? setPasscode : setConfirm;
    if (digit === "delete") {
      setCurrent(current.slice(0, -1));
      return;
    }
    if (current.length >= 6) return;
    const next = current + digit;
    setCurrent(next);
    if (next.length === 6) {
      if (step === "passcode") {
        window.setTimeout(() => setStep("confirm"), 160);
      } else {
        window.setTimeout(() => {
          if (next !== passcode) {
            setConfirm("");
            setError("两次密码不一致，请重新输入确认密码。");
          } else {
            onComplete({
              ownerName: ownerName.trim(),
              stageName: stageName.trim(),
              age: Number(age),
              supportColor,
              passcode,
            });
          }
        }, 160);
      }
    }
  }

  return (
    <main className="idol-setup">
      <div className="idol-setup-glow" />
      <header className="idol-setup-topline">
        <span>FOUNDPHONE / PRIVATE ARCHIVE</span>
        <span>{step === "profile" ? "01 — IDENTITY" : step === "passcode" ? "02 — SECURITY" : "03 — CONFIRM"}</span>
      </header>

      {step === "profile" ? (
        <section className="idol-setup-card" aria-labelledby="profile-title">
          <div className="idol-monogram"><Sparkles size={20} strokeWidth={1.4} /></div>
          <p className="idol-kicker">YOUR STORY BEGINS HERE</p>
          <h1 id="profile-title">先认识你，<br /><em>再为你点亮星光。</em></h1>
          <p className="idol-intro">建立你的专属机主资料。你的姓名、艺名与应援色，将成为这段故事的一部分。</p>
          <form onSubmit={submitProfile} className="idol-profile-form">
            <label>机主姓名 <span>PRIVATE NAME</span>
              <input autoComplete="name" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="输入你的姓名" maxLength={40} required />
            </label>
            <label>艺名 <span>STAGE NAME</span>
              <input value={stageName} onChange={e => setStageName(e.target.value)} placeholder="你希望别人如何称呼你" maxLength={30} required />
            </label>
            <label>年龄 <span>AGE</span>
              <select value={age} onChange={e => setAge(e.target.value)}>{Array.from({ length: 83 }, (_, i) => i + 13).map(n => <option key={n} value={n}>{n} 岁</option>)}</select>
            </label>
            <fieldset className="idol-color-field">
              <legend>专属应援色 <span>YOUR SIGNATURE COLOR</span></legend>
              <div className="idol-colors">{colors.map(color => (
                <button key={color.value} type="button" className={supportColor === color.value ? "selected" : ""} onClick={() => setSupportColor(color.value)} aria-label={color.name} aria-pressed={supportColor === color.value}>
                  <span style={{ background: color.value }} />{color.name}{supportColor === color.value && <Check size={12} />}
                </button>
              ))}</div>
            </fieldset>
            {error && <p className="idol-form-error" role="alert">{error}</p>}
            <button className="idol-start-button" type="submit">继续设置密码 <ArrowRight size={17} /></button>
          </form>
          <p className="idol-privacy-note">资料保存在此浏览器中。姓名可使用昵称，无需填写真实身份。</p>
        </section>
      ) : (
        <section className="idol-setup-card idol-passcode-card" aria-labelledby="passcode-title">
          <button className="idol-back-button" type="button" onClick={() => { setError(""); setStep(step === "confirm" ? "passcode" : "profile"); }} aria-label="返回上一步"><ArrowLeft size={17} /> 返回</button>
          <div className="idol-monogram"><LockKeyhole size={19} strokeWidth={1.4} /></div>
          <p className="idol-kicker">PERSONAL DEVICE SECURITY</p>
          <h1 id="passcode-title">{step === "passcode" ? "创建手机密码" : "再次输入密码"}</h1>
          <p className="idol-intro">{step === "passcode" ? "像设置 iPhone 一样，输入 4–6 位数字，为你的手机设定解锁密码。" : "请再次输入刚刚设置的数字密码，确认无误后就会生成你的专属手机。"} </p>
          <div className="idol-passcode-dots" aria-label={"已输入" + (step === "passcode" ? passcode.length : confirm.length) + "位数字"}>
            {Array.from({ length: step === "passcode" ? Math.max(6, passcode.length) : Math.max(6, confirm.length) }, (_, i) => <span key={i} className={(step === "passcode" ? passcode : confirm).length > i ? "filled" : ""} />)}
          </div>
          <p className="idol-passcode-hint">{error || (step === "passcode" ? "建议使用 6 位数字密码" : "再次输入以确认")}</p>
          <div className="idol-keypad" aria-label="数字密码键盘">
            {["1","2","3","4","5","6","7","8","9","", "0","delete"].map((digit, i) => digit ? (
              <button key={digit} type="button" className={digit === "delete" ? "delete-key" : ""} aria-label={digit === "delete" ? "删除一位" : "输入数字" + digit} onClick={() => enterDigit(digit)}>
                {digit === "delete" ? <Delete size={20} strokeWidth={1.5} /> : digit}
              </button>
            ) : <span key={"empty-" + i} />)}
          </div>
          <p className="idol-privacy-note">此密码用于模拟手机锁屏，不是账户级安全保护。请勿使用真实账户密码。</p>
        </section>
      )}

      <footer className="idol-setup-footer"><span>FOUNDPHONE STUDIO</span><span>MADE OF DREAMS · BUILT FOR YOU</span></footer>
    </main>
  );
}
