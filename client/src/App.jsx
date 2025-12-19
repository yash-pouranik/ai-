import { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    techStack: '',
    audience: 'Developers',
    platform: 'X'
  });
  
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header>
          <div className="badge">BETA v1.0</div>
          <h1>AI Launch Assistant</h1>
          <p className="subtitle">Craft viral launch copy in seconds.</p>
        </header>

        <main className="grid-layout">
          {/* Left Column: Controls */}
          <section className="input-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  name="productName" 
                  value={formData.productName} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. NexusDB"
                />
              </div>

              <div className="form-group">
                <label>One-line Pitch</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. An open-source vector database for AI agents."
                />
              </div>

              <div className="form-group">
                <label>Tech Stack</label>
                <input 
                  type="text" 
                  name="techStack" 
                  value={formData.techStack} 
                  onChange={handleChange} 
                  placeholder="e.g. Rust, LangChain, Next.js"
                />
              </div>

              <div className="split-row">
                <div className="form-group">
                  <label>Audience</label>
                  <select name="audience" value={formData.audience} onChange={handleChange}>
                    <option value="Developers">Developers</option>
                    <option value="Founders">Founders</option>
                    <option value="Investors">Investors</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Platform</label>
                  <select name="platform" value={formData.platform} onChange={handleChange}>
                    <option value="X">X (Twitter)</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Landing Page">Landing Page</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="generate-btn">
                {loading ? 'Processing...' : 'Generate Magic ✨'}
              </button>
              
              {error && <div className="error-toast">{error}</div>}
            </form>
          </section>

{/* Right Column: Output */}
<section className="output-section">
  <div className="output-header">
    <h3>Generated Output</h3>
    {result && <span className="tag">Ready</span>}
  </div>
  
  <div className={`output-box ${loading ? 'pulsing' : ''}`}>
    {result ? (
      <div className="result-grid">
        {/* Map over the JSON array */}
        {Array.isArray(result) && result.map((item, index) => (
          <div key={index} className="result-card">
            <h4>{item.title}</h4>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    ) : (
      <div className="placeholder-state">
        <div className="placeholder-icon">⚡</div>
        <p>AI response will appear here</p>
      </div>
    )}
  </div>
</section>
        </main>
      </div>
    </div>
  );
}

export default App;