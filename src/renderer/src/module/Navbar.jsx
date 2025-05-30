import '../assets/Style.css';

const Navbar = ({ username, setIsLoggedIn }) => (
  <div className="navbar">
    <h1>Advanced SelfBot - Music</h1>
    {username && (
      <div className="user-info">Logged in as: <span className="username">{username}</span></div>
    )}
  </div>
);

export default Navbar;