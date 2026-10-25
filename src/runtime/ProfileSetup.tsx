import { useRef, useState, type FormEvent } from "react";
import "./profile-setup.css";

export type IdolProfile = {
  ownerName: string;
  stageName: string;
  age: number;
  supportColor: string;
  passcode: string;
  avatar: string;
  signature: string;
  deviceName: string;
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
  const [avatar, setAvatar] = useState("");
  const [signature, setSignature] = useState("");
  const [deviceName, setDeviceName] = useState("我的 iPhone");
  const fileRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!ownerName.trim() || !stageName.trim()) {
      setError("请填写本名与艺名，让档案完整一些。");
      return;
    }
    if (!/^\d{4,6}$/.test(passcode)) {
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
      avatar,
      signature: signature.trim(),
      deviceName: deviceName.trim() || "我的 iPhone",
    });
  }

  return (
    <main className="idol-setup">
      <div className="idol-setup-glow" />
      <div className="idol-setup-topline"><span>FOUNDPHONE · PRIVATE DEVICE</span><span>01 / PROFILE</span></div>
      <section className="idol-setup-card">
        <div className="idol-monogram">✳</div>
        <p className="idol-kicker">YOUR STORY BEGINS HERE</p>
        <h1>先认识机主，<br /><em>再开启手机。</em></h1>
        <p className="idol-intro">建立你的专属资料卡。名字、头像与密码会保存在当前浏览器，之后打开手机时继续使用。</p>
        <form onSubmit={submit}>
          <div className="idol-avatar-editor">
            <div className="idol-avatar-preview" style={avatar ? { backgroundImage: `url("${avatar}")` } : undefined}>{!avatar && <span>{stageName.trim().slice(0, 1) || "✳"}</span>}</div>
            <div className="idol-avatar-actions"><strong>机主头像 <small>OWNER AVATAR</small></strong><button type="button" onClick={() => fileRef.current?.click()}>拍照 / 从相册选择</button><input ref={fileRef} className="idol-hidden-file" type="file" accept="image/*" capture="user" onChange={async e => { const file=e.target.files?.[0]; if (!file) return; try { const data=await new Promise<string>((resolve,reject)=>{ const reader=new FileReader(); reader.onerror=()=>reject(); reader.onload=()=>{ const img=new Image(); img.onerror=()=>reject(); img.onload=()=>{ const canvas=document.createElement("canvas"); const scale=Math.min(1,640/Math.max(img.width,img.height)); canvas.width=Math.max(1,Math.round(img.width*scale)); canvas.height=Math.max(1,Math.round(img.height*scale)); canvas.getContext("2d")?.drawImage(img,0,0,canvas.width,canvas.height); resolve(canvas.toDataURL("image/jpeg",0.78)); }; img.src=String(reader.result); }; reader.readAsDataURL(file); }); setAvatar(data); setError(""); } catch { setError("照片读取失败，请重新选择。"); } e.currentTarget.value=""; }} /></div>
          </div>
          <div className="idol-field-grid">
            <label>机主姓名<input autoComplete="name" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="你的真实姓名" maxLength={40} required /></label>
            <label>艺名 STAGE NAME<input value={stageName} onChange={e => setStageName(e.target.value)} placeholder="舞台上的名字" maxLength={30} required /></label>
          </div>
          <label>设备名称 DEVICE NAME<input value={deviceName} onChange={e => setDeviceName(e.target.value)} maxLength={40} placeholder="例如：我的 iPhone" /></label>
          <label>个性签名 SIGNATURE<input value={signature} onChange={e => setSignature(e.target.value)} maxLength={80} placeholder="留一句只属于你的话" /></label>
          <label>年龄 AGE<select value={age} onChange={e => setAge(e.target.value)}>{Array.from({length: 19}, (_, i) => i + 16).map(n => <option key={n} value={n}>{n} 岁</option>)}</select></label>
          <fieldset className="idol-color-field">
            <legend>专属应援色 SUPPORT COLOR</legend>
            <div className="idol-colors">{colors.map(color => <button key={color.value} type="button" className={supportColor === color.value ? "selected" : ""} onClick={() => setSupportColor(color.value)} aria-label={color.name} aria-pressed={supportColor === color.value}><span style={{background: color.value}} />{color.name}</button>)}</div>
          </fieldset>
          <div className="idol-passcode-heading"><span>设置手机锁屏密码</span><small>与 iPhone 数字密码体验一致</small></div>
          <div className="idol-field-grid">
            <label>新密码<input type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={passcode} onChange={e => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="4–6 位数字" required /></label>
            <label>确认密码<input type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={confirm} onChange={e => setConfirm(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="再次输入" required /></label>
          </div>
          {error && <p className="idol-form-error" role="alert">{error}</p>}
          <button className="idol-start-button" type="submit">创建专属手机 <span>↗</span></button>
          <p className="idol-privacy-note">档案仅保存在当前浏览器。此处密码用于模拟手机解锁，不是账户级安全保护。</p>
        </form>
      </section>
      <footer className="idol-setup-footer"><span>FOUNDPHONE STUDIO</span><span>YOUR PHONE, YOUR STORY</span></footer>
    </main>
  );
}
