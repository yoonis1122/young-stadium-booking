import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/api';
import './TimeSlotsPage.css';

const TimeSlotsPage = () => {
    const [stadiums, setStadiums] = useState([]);
    const [selectedStadium, setSelectedStadium] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newSlots, setNewSlots] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        API.get('/stadiums').then(({ data }) => setStadiums(data));
    }, []);

    const loadSlots = async () => {
        if (!selectedStadium || !selectedDate) return;
        setLoading(true);
        const { data } = await API.get(`/timeslots/${selectedStadium}?date=${selectedDate}`);
        setSlots(data);
        setLoading(false);
    };

    useEffect(() => { loadSlots(); }, [selectedStadium, selectedDate]);

    const handleCreateSlots = async (e) => {
        e.preventDefault();
        setSaving(true); setError(''); setSuccess('');
        try {
            const parsedSlots = newSlots.split(',').map((s) => {
                const [start, end] = s.trim().split('-');
                return { startTime: start?.trim(), endTime: end?.trim() };
            }).filter((s) => s.startTime && s.endTime);
            await API.post('/timeslots', { stadiumId: selectedStadium, date: selectedDate, slots: parsedSlots });
            toast.success(`${parsedSlots.length} slot(s) created!`);
            setSuccess(`${parsedSlots.length} slot(s) created!`);
            setNewSlots('');
            loadSlots();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create slots.');
            setError(err.response?.data?.message || 'Failed to create slots.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this slot?')) return;
        try {
            await API.delete(`/timeslots/${id}`);
            toast.success('Slot deleted successfully');
            loadSlots();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete slot.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <div><h1>Time Slots</h1><p>Manage available booking slots per stadium</p></div>
            </div>

            <div className="timeslots-filters card" style={{ marginBottom: 24 }}>
                <div className="timeslots-filters-row">
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Stadium</label>
                        <select className="form-control" value={selectedStadium} onChange={(e) => setSelectedStadium(e.target.value)}>
                            <option value="">Select a stadium</option>
                            {stadiums.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Date</label>
                        <input type="date" className="form-control" min={today} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                </div>
            </div>

            {selectedStadium && selectedDate && (
                <>
                    <div className="card" style={{ marginBottom: 24 }}>
                        <h3 style={{ marginBottom: 16 }}>Create New Slots</h3>
                        {error && <div className="alert alert-error" style={{ marginBottom: 12 }}>{error}</div>}
                        {success && <div className="alert alert-success" style={{ marginBottom: 12 }}>{success}</div>}
                        <form onSubmit={handleCreateSlots} className="timeslots-create-form">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Slots (startTime-endTime, comma separated)</label>
                                <input
                                    className="form-control"
                                    placeholder="08:00-09:00, 09:00-10:00, 10:00-11:00"
                                    value={newSlots}
                                    onChange={(e) => setNewSlots(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-end' }}>
                                {saving ? 'Creating...' : 'Create Slots'}
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: 16 }}>Slots for {selectedDate}</h3>
                        {loading ? (
                            <div className="loading" style={{ minHeight: 80 }}><div className="spinner" /></div>
                        ) : slots.length === 0 ? (
                            <p className="text-muted">No slots found. Create some above.</p>
                        ) : (
                            <div className="slots-list">
                                {slots.map((slot) => (
                                    <div key={slot._id} className={`slot-item ${slot.isBooked ? 'slot-item-booked' : ''}`}>
                                        <span className="slot-time">🕐 {slot.startTime} – {slot.endTime}</span>
                                        <span className={`badge ${slot.isBooked ? 'badge-red' : 'badge-green'}`}>
                                            {slot.isBooked ? 'Booked' : 'Available'}
                                        </span>
                                        {!slot.isBooked && (
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(slot._id)}>Delete</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default TimeSlotsPage;
