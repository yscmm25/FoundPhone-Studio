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

type Step = "profile" | "create-passcode" | "confirm-passcode";

export function ProfileSetup({ onComplete }: { onComplete: (profile: IdolProfile) => void }) {
  const [step, setStep] = useState<Step>("profile");
  const [ownerName, setOwnerName] = useState("");
  const [stageName, setStageName] = useState("");
  const [age, setAge] = useState("20");
  const [supportColor, setSupportColor] = useState(colors[0].value);
  const [passcodeLength, setPasscodeLength] = useState<4 | 6>(6);
  const [passcode, setPasscode] = useState("");
  const [entry, setEntry] = useState("");
  const [error, setError] = useState("");

  function startPasscode(event: FormEvent) {
    event.preventDefault();
    if (!ownerName.trim() || !stageName.trim()) {
      setError("请填写机主姓名与艺名。");
      return;
    }
    setError("");
    setEntry("");
    setStep("create-passcode");
  }

  function pressDigit(digit: string) {
    setError("");
    if (digit === "delete") {
      setEntry((current) => current.slice(0, -1));
      return;
    }
    if (entry.length >= passcodeLength) return;
    const next = entry + digit;
    setEntry(next);
    if (next.length !== passcodeLength) return;

    if (step === "create-passcode") {
      setPasscode(next);
      setEntry("");
      setStep("confirm-passcode");
    } else if (step === "confirm-passcode") {
      if (next !== passcode) {
        setEntry("");
        setError("密码不一致，请重新输入确认密码。");
        return;
      }
      onComplete({
        ownerName: ownerName.trim(),
        stageName: stageName.trim(),
        age: Number(age),
        supportColor,
        passcode,
      });
    }
  }

  const heading = step === "create-passcode" ? "创建数字密码" : "确认你的密码";
  const subtitle = step === "create-passcode"
    ? "设置用于解锁这部手机的专属密码"
    : "请再次输入刚才设置的数字密码";
  const backToProfile = () => {
    setStep("profile");
    setPasscode("");
    setEntry("");
    setError("");
  };

  return (
    <main className="idol-setup">
      <div className="idol-setup-glow" aria-hidden="true" />
      <header className="idol-setup-topline">
        <span>FOUNDPHONE / PRIVATE ARCHIVE</span>
        <span>{step === "profile" ? "01 — 02" : "02 — 02"}</span>
      </header>

      {step === "profile" ? (
        <section className="idol-setup-card" aria-labelledby="profile-title">
          <div className="idol-monogram"><Sparkles size={20} strokeWidth={1.4} /></div>
          <p className="idol-kicker">YOUR STORY, YOUR IDENTITY</p>
          <h1 id="profile-title">先认识你，<br /><em>再开启故事。</em></h1>
          <p className="idol-intro">为你的专属手机建立一份私人档案。你的名字、舞台身份与喜爱的颜色，将成为这个世界认识你的方式。</p>

          <form onSubmit={startPasscode} className="idol-profile-form">
            <div className="idol-field-grid">
              <label>机主姓名 <span>YOUR NAME</span>
                <input autoComplete="name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="输入你的姓名" maxLength={40} required />
              </label>
              <label>艺名 <span>STAGE NAME</span>
                <input value={stageName} onChange={(e) => setStageName(e.target.value)} placeholder="你希望被如何称呼" maxLength={30} required />
              </label>
            </div>
            <label>年龄 <span>AGE</span>
              <select value={age} onChange={(e) => setAge(e.target.value)}>
                {Array.from({ length: 83 }, (_, i) => i + 13).map((n) => <option key={n} value={n}>{n} 岁</option>)}
              </select>
            </label>

            <fieldset className="idol-color-field">
              <legend>专属应援色 <span>YOUR SIGNATURE COLOR</span></legend>
              <div className="idol-colors">
                {colors.map((color) => (
                  <button key={color.value} type="button" className={supportColor === color.value ? "selected" : ""} onClick={() => setSupportColor(color.value)} aria-label={color.name} aria-pressed={supportColor === color.value}>
                    <span className="idol-color-swatch" style={{ background: color.value }} />
                    {color.name}
                    {supportColor === color.value && <Check size={12} />}
                  </button>
                ))}
              </div>
            </fieldset>

            {error && <p className="idol-form-error" role="alert">{error}</p>}
            <button className="idol-start-button" type="submit">继续设置锁屏密码 <ArrowRight size={16} /></button>
            <p className="idol-privacy-note">资料保存在此浏览器中。请勿使用真实账户密码；此密码仅用于模拟手机解锁。</p>
          </form>
        </section>
      ) : (
        <section className="idol-setup-card idol-passcode-card" aria-labelledby="passcode-title">
          <button className="idol-back-button" type="button" onClick={backToProfile}><ArrowLeft size={15} /> 返回个人资料</button>
          <div className="idol-lock-emblem"><LockKeyhole size={23} strokeWidth={1.3} /></div>
          <p className="idol-kicker">DEVICE SECURITY</p>
          <h1 id="passcode-title">{heading}</h1>
          <p className="idol-intro idol-passcode-intro">{subtitle}</p>

          <div className="idol-passcode-dots" aria-label={`已输入 ${entry.length} 位数字`}>
            {Array.from({ length: passcodeLength }, (_, i) => <span key={i} className={i < entry.length ? "filled" : ""} />)}
          </div>
          <div className="idol-passcode-length" aria-label="密码位数">
            <button type="button" className={passcodeLength === 4 ? "selected" : ""} onClick={() => { setPasscodeLength(4); setEntry(""); setPasscode(""); setStep("create-passcode"); setError(""); }}>4 位密码</button>
            <button type="button" className={passcodeLength === 6 ? "selected" : ""} onClick={() => { setPasscodeLength(6); setEntry(""); setPasscode(""); setStep("create-passcode"); setError(""); }}>6 位密码</button>
          </div>

          <div className="idol-keypad" aria-label="数字密码键盘">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "empty", "0", "delete"].map((key, i) => key === "empty" ? (
              <span key={key} aria-hidden="true" />
            ) : key === "delete" ? (
              <button key={key} type="button" className="idol-keypad-delete" aria-label="删除一位数字" onClick={() => pressDigit("delete")}><Delete size={19} strokeWidth={1.5} /></button>
            ) : (
              <button key={key} type="button" onClick={() => pressDigit(key)} aria-label={`数字 ${key}`}><span>{key}</span></button>
            ))}
          </div>
          {error && <p className="idol-form-error idol-passcode-error" role="alert">{error}</p>}
          <p className="idol-privacy-note idol-passcode-note">完成后，手机将以「{stageName.trim()}」为机主名称，并启用你设置的锁屏密码。</p>
        </section>
      )}

      <footer className="idol-setup-footer"><span>FOUNDPHONE STUDIO</span><span>MADE OF DREAMS · BUILT FOR YOU</span></footer>
    </main>
  );
}
