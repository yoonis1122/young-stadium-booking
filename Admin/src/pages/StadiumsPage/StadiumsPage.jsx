import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/api';
import './StadiumsPage.css';

const emptyForm = { name: '', location: '', description: '', image: '', pricePerHour: '', sizesAvailable: '' };

const StadiumsPage = () => {
    const [stadiums, setStadiums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetch = async () => {
        const { data } = await API.get('/stadiums/admin/all');
        setStadiums(data);
        setLoading(false);
    };
    useEffect(() => { fetch(); }, []);

    const openAdd = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
    const openEdit = (s) => {
        setEditing(s);
        setForm({
            name: s.name, location: s.location, description: s.description,
            image: s.image, pricePerHour: s.pricePerHour,
            sizesAvailable: s.sizesAvailable.map((x) => `${x.label}:${x.maxPlayers}:${x.pricePerHour}`).join(', '),
        });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Deactivate this stadium?')) return;
        try {
            await API.delete(`/stadiums/${id}`);
            toast.success('Stadium deactivated successfully');
            fetch();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to deactivate stadium.');
        }
    };

    const parseSizes = (str) =>
        str.split(',').map((s) => {
            const [label, maxPlayers, pricePerHour] = s.trim().split(':');
            return { label: label.trim(), maxPlayers: Number(maxPlayers), pricePerHour: Number(pricePerHour) };
        }).filter((s) => s.label);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = {
                name: form.name, location: form.location, description: form.description,
                image: form.image, pricePerHour: Number(form.pricePerHour),
                sizesAvailable: parseSizes(form.sizesAvailable),
            };
            if (editing) {
                await API.put(`/stadiums/${editing._id}`, payload);
                toast.success('Stadium updated successfully');
            } else {
                await API.post('/stadiums', payload);
                toast.success('Stadium created successfully');
            }
            setShowModal(false);
            fetch();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save stadium.');
            setError(err.response?.data?.message || 'Failed to save stadium.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading"><div className="spinner" /></div>;

    return (
        <div className="stadiums-admin-page">
            <div className="page-header">
                <div><h1>Stadiums</h1><p>Manage all your football pitches</p></div>
                <button className="btn btn-primary" onClick={openAdd}>+ Add Stadium</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr><th>Name</th><th>Location</th><th>Base Price/hr</th><th>Sizes</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {stadiums.map((s) => (
                            <tr key={s._id}>
                                <td>
                                    <div className="stadium-table-name">
                                        <img
                                            src={s.image}
                                            alt={s.name}
                                            className="stadium-table-img"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=200';
                                                e.target.onerror = null; // Prevent infinite loop
                                            }}
                                        />
                                        <strong>{s.name}</strong>
                                    </div>
                                </td>
                                <td>{s.location}</td>
                                <td>${s.pricePerHour}</td>
                                <td>{s.sizesAvailable.map((x) => x.label).join(', ')}</td>
                                <td><span className={`badge ${s.isActive ? 'badge-green' : 'badge-red'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'Edit Stadium' : 'Add Stadium'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
                        <form onSubmit={handleSave} className="modal-form">
                            <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                            <div className="form-group"><label>Location</label><input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
                            <div className="form-group"><label>Description</label><textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                            <div className="form-group"><label>Image URL</label><input className="form-control" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
                            <div className="form-group"><label>Base Price / hr ($)</label><input type="number" className="form-control" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} required /></div>
                            <div className="form-group">
                                <label>Sizes (label:maxPlayers:price, ...)</label>
                                <input className="form-control" placeholder="3+GK:8:150, 4+GK:10:200" value={form.sizesAvailable} onChange={(e) => setForm({ ...form, sizesAvailable: e.target.value })} required />
                                <span className="form-hint">Format: label:maxPlayers:pricePerHour, separated by commas</span>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Stadium'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StadiumsPage;
