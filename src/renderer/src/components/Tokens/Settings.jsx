import React, { useState, useEffect } from 'react';
import MarkdownRenderer from "../../module/MDRender";

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
    <>
      <MarkdownRenderer content="**Bot Settings:**" />
      <div style={modalStyles.formGroup}>
        <label>Leave Voice Empty:</label>
        <input 
          type="number" 
          name="leave_empty" 
          value={formValues.leave_empty} 
          placeholder={DEFAULT_SETTINGS.leave_empty}
          onChange={handleChange} 
        />
      </div>
    </>
  );

  const renderLavaLinkSettings = () => (
    <>
      <MarkdownRenderer content="**LavaLink Settings**" />
      <div style={modalStyles.formGroup}>
        <label>Node Name:</label>
        <input 
          type="text" 
          name="node_name" 
          value={formValues.nodes[0].name}
          placeholder={DEFAULT_SETTINGS.nodes[0].name}
          onChange={(e) => handleNodeChange("name", e.target.value)}
        />
      </div>
      <div style={modalStyles.formGroup}>
        <label>Node Host/Port:</label>
        <input 
          type="text" 
          name="node_host" 
          value={formValues.nodes[0].url}
          placeholder={DEFAULT_SETTINGS.nodes[0].url}
          onChange={(e) => handleNodeChange("url", e.target.value)}
        />
      </div>
      <div style={modalStyles.formGroup}>
        <label>Node Password:</label>
        <input 
          type="password" 
          name="node_password" 
          value={formValues.nodes[0].auth}
          placeholder={DEFAULT_SETTINGS.nodes[0].auth}
          onChange={(e) => handleNodeChange("auth", e.target.value)}
        />
      </div>
    </>
  );

  const renderButtons = () => (
    <div style={modalStyles.buttonContainer}>
      <button 
        type="submit" 
        style={modalStyles.primaryButton}
      >
        Save
      </button>
      <button 
        type="button" 
        onClick={onClose} 
        style={modalStyles.secondaryButton}
      >
        Cancel
      </button>
      <button 
        type="button" 
        onClick={handleResetToDefault} 
        style={modalStyles.primaryButton}
      >
        Load Default
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          {renderBotSettings()}
          {renderLavaLinkSettings()}
          {renderButtons()}
        </form>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease-out"
  },
  modal: {
    background: "var(--bg-darker)",
    padding: "1.5rem",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
    border: "1px solid var(--border-color)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    animation: "slideIn 0.2s ease-out"
  },
  formGroup: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1.5rem"
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    border: "none"
  },
  primaryButton: {
    background: "var(--primary)",
    color: "var(--text-light)",
    "&:hover": {
      background: "var(--primary-dark)"
    }
  },
  secondaryButton: {
    background: "transparent",
    color: "var(--text-gray)",
    border: "1px solid var(--border-color)",
    "&:hover": {
      background: "var(--hover-bg)",
      color: "var(--text-light)",
      borderColor: "var(--primary)"
    }
  }
};

export default Settings;