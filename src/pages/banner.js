import React, { useEffect, useState } from "react";

const API = "https://slttranportdatabse.onrender.com/api/banners";

export default function BannerAdmin() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API}/all`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const addBanner = async () => {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image_url", file);

    try {
      const res = await fetch(`${API}/add`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFile(null);
      setPreview(null);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Failed to upload banner: " + err.message);
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      const res = await fetch(`${API}/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete banner");
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (banner) => {
    try {
      const res = await fetch(`${API}/update/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: banner.image_url,
          is_active: !banner.is_active,
        }),
      });
      if (!res.ok) throw new Error("Failed to update banner");
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper { font-family: 'Segoe UI', sans-serif; background: #f4f7f6; min-height: 100vh; display: flex; }
        .sidebar { width: 250px; background: #002147; color: white; padding: 20px; }
        .main-content { flex: 1; padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .upload-section { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 40px; display: flex; gap: 15px; align-items: center; }
        .custom-file-input { flex: 1; border: 2px dashed #cbd5e1; padding: 10px; border-radius: 8px; text-align: center; cursor: pointer; }
        .btn-add { background: #f7b731; color: #002147; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .btn-add:hover { background: #e0a526; }
        .preview-img { max-height: 80px; border-radius: 8px; margin-right: 10px; object-fit: cover; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7b731; color: #002147; }
        tr:hover { background: #f1f5f9; }
        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .active-bg { background: #dcfce7; color: #166534; }
        .inactive-bg { background: #fee2e2; color: #991b1b; }
        .btn-action { padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 500; margin-right: 5px; }
        .btn-delete { color: #dc2626; background: #fef2f2; }
        .toggle-btn { width: 40px; height: 20px; border-radius: 12px; border: none; cursor: pointer; transition: 0.3s; }
        .toggle-on { background: #16a34a; }  /* green */
        .toggle-off { background: #dc2626; } /* red */
      `}</style>

   

      <div className="main-content">
        <div className="header">
          <h2>Banner Management</h2>
          <span style={{color: '#64748b'}}>Total Banners: {banners.length}</span>
        </div>

        <div className="upload-section">
          {preview && <img src={preview} alt="Preview" className="preview-img" />}
          <input
            type="file"
            className="custom-file-input"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button className="btn-add" onClick={addBanner}>Upload New Banner</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>{banner.id}</td>
                <td>
                  <img src={banner.image_url} alt="Banner" style={{ maxHeight: '60px', borderRadius: '6px' }} />
                </td>
                <td>
                  <span className={`status-badge ${banner.is_active ? 'active-bg' : 'inactive-bg'}`}>
                    {banner.is_active ? "Live" : "Hidden"}
                  </span>
                </td>
                <td>
                  {/* Toggle button */}
                  <button
                    className={`toggle-btn ${banner.is_active ? 'toggle-on' : 'toggle-off'}`}
                    onClick={() => toggleActive(banner)}
                  ></button>
                  <button className="btn-action btn-delete" onClick={() => deleteBanner(banner.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
