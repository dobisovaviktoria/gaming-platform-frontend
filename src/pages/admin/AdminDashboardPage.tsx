import { useState } from 'react';
import './AdminDashboardPage.scss';
import Navbar from "../../components/Navbar.tsx";
import SideMenu from "../../components/overlays/SideMenu.tsx";
import {useSearch} from "../../hooks/useSearch.ts";

interface DataItem {
    id: string;
    label: string;
    value: string;
    item: "data";
}

interface PredictionItem {
    id: string;
    label: string;
    value: string;
    item: "prediction";
}

export default function AdminDashboardPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sample data - replace with actual data
    const dataItems: DataItem[] = [
        { id: '1', label: 'Data Item 1', value: 'Value 1' , item: "data" },
        { id: '2', label: 'Data Item 2', value: 'Value 2' , item: "data" },
        { id: '3', label: 'Data Item 3', value: 'Value 3' , item: "data" },
        { id: '4', label: 'Data Item 4', value: 'Value 4' , item: "data" },
    ];

    const predictions: PredictionItem[] = [
        { id: '1', label: 'Prediction 1', value: 'Value 1' , item: "prediction" },
        { id: '2', label: 'Prediction 2', value: 'Value 2' , item: "prediction" },
        { id: '3', label: 'Prediction 3', value: 'Value 3' , item: "prediction" },
        { id: '4', label: 'Prediction 4', value: 'Value 4' , item: "prediction" },
    ];

    const handleExport = () => {
        console.log('Exporting data...');
    };

    const handleTriggerAI = () => {
        console.log('Triggering AI vs AI...');
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    const { searchQuery, searchResults, isLoading, error, handleSearch } = useSearch<DataItem | PredictionItem>({
        data: [].concat(dataItems).concat(predictions),
        searchField: 'label',
    });

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0 && !error;

    return (
        <div className="page admin-dashboard">
            <Navbar onMenuToggle={handleMenuToggle}/>
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Example"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                />
                {isLoading && <span className="loading-spinner">⏳</span>}
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {showNoResults && (
                <div className="no-results">
                    <div className="sad-face">☹️</div>
                    <h2>No results found</h2>
                    <p>Try again...</p>
                </div>
            )}

            {searchResults.length > 0 && (

                <main className="dashboard-content">
                    <section className="data-section">
                        <h2 className="section-title">Data</h2>
                        <div className="data-list">
                            {searchResults.filter(item => item.item === "data").map((item) => (
                                <div key={item.id} className="data-item">
                                    <span className="item-label">{item.label}</span>
                                    <span className="item-value">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="predictions-section">
                        <h2 className="section-title">Predictions</h2>
                        <div className="predictions-list">
                            {searchResults.filter(item => item.item === "prediction").map((item) => (
                                <div key={item.id} className="prediction-item">
                                    <span className="item-label">{item.label}</span>
                                    <span className="item-value">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="section-actions">
                            <button className="export-btn" onClick={handleExport}>
                                Export
                            </button>
                        </div>
                    </section>
                </main>
            )}

            <footer className="dashboard-footer">
                <button className="trigger-ai-btn" onClick={handleTriggerAI}>
                    Trigger AI vs AI
                </button>
            </footer>
        </div>
    );
}
