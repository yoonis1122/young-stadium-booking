import { useEffect, useState } from 'react';
import API from '../../api/api';
import StadiumCard from '../../components/StadiumCard/StadiumCard';
import './StadiumsPage.css';

const StadiumsPage = () => {
    const [stadiums, setStadiums] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/stadiums').then(({ data }) => {
            setStadiums(data);
            setFiltered(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!search) return setFiltered(stadiums);
        setFiltered(stadiums.filter(
            (s) =>
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.location.toLowerCase().includes(search.toLowerCase())
        ));
    }, [search, stadiums]);

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="stadiums-header">
                    <h1 className="section-title">All <span className="text-green">Stadiums</span></h1>
                    <p className="section-subtitle">Find and book the perfect pitch for your game</p>
                </div>

                <div className="stadiums-search">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="🔍  Search by name or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-icon">🏟️</div>
                        <h3>No stadiums found</h3>
                        <p>Try a different search term</p>
                    </div>
                ) : (
                    <>
                        <p className="results-count">{filtered.length} stadium{filtered.length !== 1 ? 's' : ''} found</p>
                        <div className="grid-3">
                            {filtered.map((s) => <StadiumCard key={s._id} stadium={s} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StadiumsPage;
