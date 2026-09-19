export default function Stats({ total }) {
  return (
    <div className="card" style={{ position: "absolute", top: 20, right: 20, zIndex: 10, background: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2>{total}</h2>
      <p>Total Pedagang</p>
    </div>
  );
}
