import { useState, type FormEvent } from "react";
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

export function ProfileSetup({ onComplete }: { onComplete: (profile: IdolProfile) => void }) {
  const [ownerName, setOwnerName] = useState("");
  const [stageName, setStageName] = useState("");
  const [age, setAge] = useState("20");
  const [supportColor, setSupportColor] = useState(colors[0].value);
  const [passcode, setPasscode] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!ownerName.trim() || !stageName.trim()) {
      setError("请填写本名与艺名，让档案完整一些。");
      return;
    }
    if (!/^\\d{4,6}$/.test(passcode)) {
      setError("请设置 4–6 位数字密码。");
      return;
    }
    if (passcode !== confirm) {
      setError("两次输入的密码不一致，请重新确认。");
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

  return (
    <main className="idol-setup">
      <div className="idol-setup-glow" />
      <div className="idol-setup-topline"><span>ARTIST PRIVATE ARCHIVE</span><span>01 / PROFILE</span></div>
      <section className="idol-setup-card">
        <div className="idol-monogram">✳</div>
        <p className="idol-kicker">YOUR STORY BEGINS HERE</p>
        <h1>欢迎来到你的<br /><em>星光档案</em></h1>
        <p className="idol-intro">从此刻起，你是故事的主角。建立你的艺人身份，七位特别的粉丝将逐渐走进你的生活。</p>
        <form onSubmit={submit}>
          <div className="idol-field-grid">
            <label>机主姓名<input autoComplete="name" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="你的真实姓名" maxLength={40} required /></label>
            <label>艺名 STAGE NAME<input value={stageName} onChange={e => setStageName(e.target.value)} placeholder="舞台上的名字" maxLength={30} required /></label>
          </div>
          <label>年龄 AGE<select value={age} onChange={e => setAge(e.target.value)}>{Array.from({length: 19}, (_, i) => i + 16).map(n => <option key={n} value={n}>{n} 岁</option>)}</select></label>
          <fieldset className="idol-color-field">
            <legend>专属应援色 SUPPORT COLOR</legend>
            <div className="idol-colors">{colors.map(color => <button key={color.value} type="button" className={supportColor === color.value ? "selected" : ""} onClick={() => setSupportColor(color.value)} aria-label={color.name} aria-pressed={supportColor === color.value}><span style={{background: color.value}} />{color.name}</button>)}</div>
          </fieldset>
          <div className="idol-passcode-heading"><span>设置手机锁屏密码</span><small>与 iPhone 数字密码体验一致</small></div>
          <div className="idol-field-grid">
            <label>新密码<input type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={passcode} onChange={e => setPasscode(e.target.value.replace(/\\D/g, "").slice(0, 6))} placeholder="4–6 位数字" required /></label>
            <label>确认密码<input type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={confirm} onChange={e => setConfirm(e.target.value.replace(/\\D/g, "").slice(0, 6))} placeholder="再次输入" required /></label>
          </div>
          {error && <p className="idol-form-error" role="alert">{error}</p>}
          <button className="idol-start-button" type="submit">创建我的档案 <span>↗</span></button>
          <p className="idol-privacy-note">档案仅保存在当前浏览器。此处密码用于模拟手机解锁，不是账户级安全保护。</p>
        </form>
      </section>
      <footer className="idol-setup-footer"><span>FOUNDPHONE STUDIO</span><span>MADE OF DREAMS · BUILT FOR YOU</span></footer>
    </main>
  );
}
