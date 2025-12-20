import React, { useState, useEffect } from "react";

const API = "https://slttranportdatabse.onrender.com/api/blogs"; 

export default function BlogAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: ""
  });

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API}/`);
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a blog cover image");

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("slug", formData.slug.toLowerCase().replace(/\s+/g, '-'));
    data.append("image", file);

    try {
      const res = await fetch(`${API}/create`, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Failed to create blog");
      alert("Blog published successfully!");
      setFormData({ title: "", description: "", slug: "" });
      setFile(null);
      fetchBlogs();
    } catch (err) {
      alert("Error creating blog: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to toggle visibility");
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete blog");
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <style>{`
        .btn-add {
          background: #f7b731; color: #002147; border: none; padding: 12px 24px; border-radius: 6px;
          font-weight: 700; cursor: pointer; transition: 0.3s; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .btn-add:hover { background: #e0a526; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(247, 183, 49, 0.3); }
        .btn-add:disabled { background: #ccc; cursor: not-allowed; }

        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f7f7f7; color: #002147; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .btn-action { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
        .btn-toggle { background: #34c759; color: white; }
        .btn-delete { background: #ff3b30; color: white; }
        .status-badge { padding: 4px 8px; border-radius: 4px; color: white; font-weight: 600; }
        .active-bg { background-color: #34c759; }
        .inactive-bg { background-color: #ff9500; }
      `}</style>

      <div className="header">
        <h2>Blog Management</h2>
        <span style={{ color: '#64748b' }}>Total Articles: {blogs.length}</span>
      </div>

      {/* Blog Upload Form */}
      <div className="upload-section" style={{ padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', color: '#002147' }}>Write New Post</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <input type="text" placeholder="Blog Title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
          <input type="text" placeholder="URL Slug" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} />
          <textarea placeholder="Blog Content / Description" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '150px' }} />
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Cover Image:</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <button className="btn-add" disabled={loading} style={{ width: 'max-content' }}>
            {loading ? "Publishing..." : "Publish Blog Post"}
          </button>
        </form>
      </div>

      {/* Blog Table */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog.id}>
              <td><img src={blog.image_url} alt={blog.title} style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} /></td>
              <td>{blog.title}</td>
              <td>{blog.description.substring(0, 80)}...</td>
              <td><span className={`status-badge ${blog.is_active ? 'active-bg' : 'inactive-bg'}`}>{blog.is_active ? 'Public' : 'Draft'}</span></td>
              <td style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-action btn-toggle" onClick={() => toggleVisibility(blog.id)}>
                  {blog.is_active ? 'Hide' : 'Show'}
                </button>
                <button className="btn-action btn-delete" onClick={() => deleteBlog(blog.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
