import React, { useState } from 'react';

function encodeConfig(config) {
  return btoa(JSON.stringify(config));
}

function decodeConfig(str) {
  try {
    return JSON.parse(atob(str));
  } catch {
    return null;
  }
}

const Form = ({ onGenerate }) => {
  const [subscribeText, setSubscribeText] = useState('');
  const [subscribeLink, setSubscribeLink] = useState('');
  const [unlockText, setUnlockText] = useState('');
  const [unlockLink, setUnlockLink] = useState('');
  const [extras, setExtras] = useState([{ text: '', link: '' }]);

  const handleExtraChange = (idx, field, value) => {
    setExtras(extras.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  };

  const addExtra = () => setExtras([...extras, { text: '', link: '' }]);
  const removeExtra = (idx) => setExtras(extras.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      subscribeText,
      subscribeLink,
      unlockText,
      unlockLink,
      extras: extras.filter(e => e.text && e.link)
    };
    onGenerate(config);
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth: 500, margin: "auto", fontFamily: 'sans-serif'}}>
      <h2>Tạo trang Sub2Unlock</h2>
      <label>Text nút Subscribe:</label>
      <input value={subscribeText} onChange={e => setSubscribeText(e.target.value)} required />
      <label>Link kênh YouTube:</label>
      <input value={subscribeLink} onChange={e => setSubscribeLink(e.target.value)} required />
      <label>Text nút Unlock:</label>
      <input value={unlockText} onChange={e => setUnlockText(e.target.value)} required />
      <label>Link đích Unlock:</label>
      <input value={unlockLink} onChange={e => setUnlockLink(e.target.value)} required />
      <h4>Thêm các nút khác (tuỳ chọn):</h4>
      {extras.map((e, idx) => (
        <div key={idx} style={{display: 'flex', gap: 4, marginBottom: 4}}>
          <input placeholder="Text" value={e.text} onChange={ev => handleExtraChange(idx, 'text', ev.target.value)} />
          <input placeholder="Link" value={e.link} onChange={ev => handleExtraChange(idx, 'link', ev.target.value)} />
          <button type="button" onClick={() => removeExtra(idx)}>❌</button>
        </div>
      ))}
      <button type="button" onClick={addExtra}>Thêm nút</button>
      <br/><br/>
      <button type="submit">Tạo trang</button>
    </form>
  );
};

const Sub2UnlockPage = ({ config }) => {
  const [unlocked, setUnlocked] = useState(false);

  const handleSubscribe = () => {
    window.open(config.subscribeLink, '_blank');
    setUnlocked(true);
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "40px auto",
      padding: 24,
      fontFamily: 'sans-serif',
      background: "#f8f8f8",
      borderRadius: 12,
      boxShadow: "0 2px 16px #0001"
    }}>
      <h2 style={{marginBottom: 24}}>Sub2Unlock</h2>
      <button
        style={{
          padding: '12px 28px',
          fontSize: 18,
          background: "#e53935",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          marginBottom: 24,
          fontWeight: 600,
          boxShadow: "0 2px 8px #b71c1c33"
        }}
        onClick={handleSubscribe}
      >
        {config.subscribeText}
      </button>
      <br/>
      <button
        style={{
          padding: '12px 28px',
          fontSize: 18,
          background: unlocked ? "#43a047" : "#bdbdbd",
          color: unlocked ? "#fff" : "#444",
          border: "none",
          borderRadius: 8,
          cursor: unlocked ? "pointer" : "not-allowed",
          opacity: unlocked ? 1 : 0.8,
          marginBottom: 32,
          fontWeight: 600,
          transition: "background 0.2s"
        }}
        disabled={!unlocked}
        onClick={() => unlocked && window.open(config.unlockLink, '_blank')}
      >
        {config.unlockText}
      </button>
      <hr style={{margin: "24px 0"}} />
      <h3 style={{marginBottom: 0}}>Menu Link</h3>
      <div style={{
        fontStyle: "italic",
        color: "#666",
        margin: "8px 0 20px 0"
      }}>
        Hãy nhấp vào Subscribe rồi quay lại để mở khóa liên kết<br/>
        <span style={{fontSize: 14}}>Click Subscribe then return to unlock the link</span>
      </div>
      {config.extras && config.extras.map((e, idx) => (
        <div key={idx} style={{marginBottom: 8}}>
          <a href={e.link} target="_blank" rel="noopener noreferrer"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 16
            }}>
            {e.text}
          </a>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [pageConfig, setPageConfig] = useState(null);

  React.useEffect(() => {
    // Nếu truy cập qua link có config, thì render trang unlock
    const params = new URLSearchParams(window.location.search);
    const configStr = params.get('c');
    if (configStr) {
      const config = decodeConfig(configStr);
      if (config) setPageConfig(config);
    }
  }, []);

  const handleGenerate = (config) => {
    const configStr = encodeConfig(config);
    const url = `${window.location.origin}${window.location.pathname}?c=${configStr}`;
    window.prompt("Link của bạn:", url);
    window.location.href = url;
  };

  if (pageConfig) return <Sub2UnlockPage config={pageConfig} />;
  return <Form onGenerate={handleGenerate} />;
}

export default App;