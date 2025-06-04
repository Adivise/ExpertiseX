import React, { useState, useEffect } from 'react';

const Settings = ({ isOpen, onClose, onSave }) => {
  // Constants
  const DEFAULT_SETTINGS = {
    leave_empty: "12000",
    nodes: [
      {
        name: "ExpertiseX",
        url: "localhost:5555",
        auth: "youshallnotpass"
      }
    ]
  };

  // State management
  const [formValues, setFormValues] = useState(DEFAULT_SETTINGS);

  // Effects
  useEffect(() => {
    loadConfig();
  }, []);

  // Initialization functions
  const loadConfig = async () => {
    try {
      const config = await window.electronAPI.loadConfig();
      setFormValues(config || DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Error loading config:", error);
      setFormValues(DEFAULT_SETTINGS);
    }
  };

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleNodeChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      nodes: prev.nodes.map((node, index) => 
        index === 0 ? { ...node, [field]: value } : node
      )
    }));
  };

  const handleResetToDefault = () => {
    setFormValues(DEFAULT_SETTINGS);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const valuesToSave = {
        ...formValues,
        leave_empty: formValues.leave_empty.trim() || DEFAULT_SETTINGS.leave_empty
      };

      await window.electronAPI.saveConfig(valuesToSave);
      onSave?.(valuesToSave);
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  // Render helpers
  const renderBotSettings = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h2>Bot Settings</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>Leave Voice Empty (ms):</label>
          <input 
            type="number" 
            name="leave_empty" 
            value={formValues.leave_empty} 
            placeholder={DEFAULT_SETTINGS.leave_empty}
            onChange={handleChange}
            className="settings-input"
          />
          <span className="input-description">Time in milliseconds before bot leaves an empty voice channel</span>
        </div>
      </div>
    </div>
  );

  const renderLavaLinkSettings = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h2>LavaLink Settings</h2>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>Node Name:</label>
          <input 
            type="text" 
            name="node_name" 
            value={formValues.nodes[0].name}
            placeholder={DEFAULT_SETTINGS.nodes[0].name}
            onChange={(e) => handleNodeChange("name", e.target.value)}
            className="settings-input"
          />
        </div>
        <div className="form-group">
          <label>Node Host/Port:</label>
          <input 
            type="text" 
            name="node_host" 
            value={formValues.nodes[0].url}
            placeholder={DEFAULT_SETTINGS.nodes[0].url}
            onChange={(e) => handleNodeChange("url", e.target.value)}
            className="settings-input"
          />
        </div>
        <div className="form-group">
          <label>Node Password:</label>
          <input 
            type="password" 
            name="node_password" 
            value={formValues.nodes[0].auth}
            placeholder={DEFAULT_SETTINGS.nodes[0].auth}
            onChange={(e) => handleNodeChange("auth", e.target.value)}
            className="settings-input"
          />
        </div>
      </div>
    </div>
  );

  const renderButtons = () => (
    <div>
      <div className="settings-buttons-right">
      <button 
        type="button" 
        onClick={handleResetToDefault} 
        className="settings-button primary"
      >
        Reset to Default
      </button>
        <button 
          type="button" 
          onClick={onClose} 
          className="settings-button secondary"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="settings-button primary"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <form onSubmit={handleSubmit} className="settings-form">
          {renderBotSettings()}
          {renderLavaLinkSettings()}
          {renderButtons()}
        </form>
      </div>
    </div>
  );
};

export default Settings;