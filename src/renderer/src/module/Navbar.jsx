import '../assets/Style.css';

const Navbar = ({ username, userId }) => {
  const version = window.electronAPI.getVersion();
  
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h1>Advanced SelfBot - Music</h1>
        <span className="version-badge">v{version}</span>
      </div>
      {username && (
        <div className="user-info">Logged in as: <span className="username">{username} ({userId})</span></div>
      )}
    </div>
  );
};

export default Navbar;