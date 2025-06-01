import React, { useState, useEffect } from 'react';
import MarkdownRenderer from "../../module/MDRender";

const Settings = ({ isOpen, onClose, onSave }) => {
  // Define default values.
  const defaultSettings = {
    leave_empty: "12000", // Default leave empty time in milliseconds
    nodes: [
      {
        name: "ExpertiseX",
        url: "localhost:5555",
        auth: "youshallnotpass"
      }
    ]
  };

  // Initialize state from defaults or from local storage.
  const [formValues, setFormValues] = useState(defaultSettings);

  useEffect(() => {
    window.electronAPI.loadConfig().then((config) => {
      if (config) {
        setFormValues(config);
      } else {
        setFormValues(defaultSettings);
      }
    });
  }, []);

  // Handle any field change.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNodeChange = (field, value) => {
    const newNodes = [...formValues.nodes];
    newNodes[0] = { ...newNodes[0], [field]: value };
    setFormValues((prev) => ({ ...prev, nodes: newNodes }));
  }

  // Reset fields to the default settings.
  const handleResetToDefault = () => {
    setFormValues(defaultSettings);
  };

  // When the form is submitted, save the settings.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValues.leave_empty.trim()) {
      formValues.leave_empty = defaultSettings.leave_empty;
    }
    window.electronAPI.saveConfig(formValues).then(() => {
        if (onSave) {
          onSave(formValues);
        }
        onClose();
    }).catch((error) => {
      console.error("Error saving settings:", error);
    });
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <MarkdownRenderer content="**Bot Settings:**" />
          <div style={modalStyles.formGroup}>
            <label>Leave Voice Empty:</label>
            <input 
                type="number" 
                name="leave_empty" 
                value={formValues.leave_empty} 
                placeholder="12000" 
                onChange={handleChange} 
            />
          </div>
          <MarkdownRenderer content="**LavaLink Settings**" />
          <div style={modalStyles.formGroup}>
            <label>Node Name:</label>
            <input 
                type="text" 
                name="node_name" 
                value={formValues.nodes[0].name}
                placeholder="ExpertiseX"
                onChange={(e) => handleNodeChange("name", e.target.value)}
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label>Node Host/Port:</label>
            <input 
                type="text" 
                name="node_host" 
                value={formValues.nodes[0].url}
                placeholder="localhost:5555"
                onChange={(e) => handleNodeChange("url", e.target.value)}
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label>Node Password:</label>
            <input 
                type="password" 
                name="node_password" 
                value={formValues.nodes[0].auth}
                placeholder="youshallnotpass"
                onChange={(e) => handleNodeChange("auth", e.target.value)}
            />
          </div>
          <div style={modalStyles.buttonContainer}>
            <button type="submit" style={modalStyles.button}>Save</button>
            <button type="button" onClick={onClose} style={modalStyles.button}>Cancel</button>
            <button type="button" onClick={handleResetToDefault} style={modalStyles.button}>Load Default</button>
          </div>
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
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "#393e46",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%"
  },
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px"
  },
  button: {
    padding: "8px 16px",
    fontSize: "16px"
  }
};

export default Settings;