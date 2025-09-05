import { Link, useNavigate } from "react-router-dom";


export default function Navbar() {
const navigate = useNavigate();
const token = localStorage.getItem("token");


const logout = () => {
localStorage.removeItem("token");
navigate("/login");
};


return (
<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
<div className="container">
<Link className="navbar-brand" to="/">MERN Shops</Link>
<button
className="navbar-toggler"
type="button"
data-bs-toggle="collapse"
data-bs-target="#navbarSupportedContent"
>
<span className="navbar-toggler-icon"></span>
</button>
<div className="collapse navbar-collapse" id="navbarSupportedContent">
<ul className="navbar-nav me-auto mb-2 mb-lg-0">
{token && (
<>
<li className="nav-item">
<Link className="nav-link" to="/shops">All Shops</Link>
</li>
<li className="nav-item">
<Link className="nav-link" to="/shops/create">Create Shop</Link>
</li>
</>
)}
</ul>
<ul className="navbar-nav ms-auto">
{!token ? (
<>
<li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
<li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
</>
) : (
<li className="nav-item">
<button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
</li>
)}
</ul>
</div>
</div>
</nav>
);
}