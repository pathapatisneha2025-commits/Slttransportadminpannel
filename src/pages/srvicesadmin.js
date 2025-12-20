import React, { useState, useEffect } from "react";

const API = "https://slttranportdatabse.onrender.com/api/services";

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: [],
    image_file: null,
  });

  const [currentPoint, setCurrentPoint] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API}/all`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  // Add single point
  const addPoint = () => {
    if (!currentPoint.trim()) return;
    setFormData({
      ...formData,
      points: [...formData.points, currentPoint.trim()],
    });
    setCurrentPoint("");
  };

  // Remove point
  const removePoint = (index) => {
    const updated = formData.points.filter((_, i) => i !== index);
    setFormData({ ...formData, points: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("points", JSON.stringify(formData.points));
      if (formData.image_file) data.append("image_file", formData.image_file);

      const res = await fetch(`${API}/add`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        alert("Service Added!");
        setFormData({
          title: "",
          description: "",
          points: [],
          image_file: null,
        });
        setCurrentPoint("");
        fetchServices();
      } else {
        alert(result.error || "Failed to add service");
      }
    } catch (err) {
      console.error("Error adding service:", err);
    }
  };

  const deleteService = async (id) => {
    if (window.confirm("Delete service?")) {
      try {
        await fetch(`${API}/delete/${id}`, { method: "DELETE" });
        fetchServices();
      } catch (err) {
        console.error("Error deleting service:", err);
      }
    }
  };

  return (
    <div className="admin-container">
      <style>{`
        .admin-container { font-family: sans-serif; }
        .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
        .btn-gold { background: #f7b731; border: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 10px; vertical-align: top; }
        th { background: #f7f7f7; }
      `}</style>

      <h1>Manage Services</h1>

      {/* ADD SERVICE FORM */}
      <div className="card">
        <h3>Add New Service</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Service Title</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Service Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image_file: e.target.files[0] })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Service Features</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={currentPoint}
                onChange={(e) => setCurrentPoint(e.target.value)}
                placeholder="Safe and timely delivery"
              />
              <button type="button" onClick={addPoint}>Add</button>
            </div>

            <ul>
              {formData.points.map((p, i) => (
                <li key={i}>
                  {p}
                  <button
                    type="button"
                    onClick={() => removePoint(i)}
                    style={{ marginLeft: "10px", color: "red", border: "none", background: "none" }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn-gold">Save Service</button>
        </form>
      </div>

      {/* SERVICES TABLE */}
      <div className="card">
        <h3>All Services</h3>

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Features</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td>
                    <img
                      src={s.image_url}
                      alt={s.title}
                      style={{ width: "80px", height: "60px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{s.title}</td>
                  <td>{s.description}</td>
                  <td>
                    <ul>
                      {Array.isArray(s.points) &&
                        s.points.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteService(s.id)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
