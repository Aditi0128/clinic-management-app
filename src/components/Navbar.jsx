import { useNavigate } from "react-router-dom";

export default function Navbar({ role, onLogout, onRoleChange }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          className="text-lg font-bold text-ink"
          onClick={() => navigate("/")}
        >
          Direction
        </button>
        <div className="ml-auto flex items-center gap-3">
          <select
            className="input w-auto"
            value={role || ""}
            onChange={(e) => onRoleChange?.(e.target.value)}
          >
            <option value="">Select role</option>
            <option value="receptionist">Receptionist</option>
            <option value="doctor">Doctor</option>
          </select>
          <button className="btn btn-ghost" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
