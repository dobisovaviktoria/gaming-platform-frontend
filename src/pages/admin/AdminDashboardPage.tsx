import { useState } from 'react';
import './AdminDashboardPage.scss';
import Navbar from "../../components/Navbar.tsx";
import SideMenu from "../../components/overlays/SideMenu.tsx";
import {useSearch} from "../../hooks/useSearch.ts";
import AISetupOverlay from "../../components/overlays/AISetupOverlay.tsx";
import LoadingOverlay from "../../components/overlays/LoadingOverlay.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {dataGeneration, getGeneratedData} from "../../services/game.ts";
import ResultsOverlay from "../../components/overlays/ResultsOverlay.tsx";
import type {DataGenerationResponse} from "../../model/types.ts";

export default function AdminDashboardPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [results, setResults] = useState<DataGenerationResponse>({
        path: "",
        player1: "",
        player2: "",
        game: "",
        wins: 0,
        draws: 0,
        losses: 0,

    });

    const { data: queriedData, isLoading: isLoadingData } = useQuery<DataGenerationResponse[], Error>({
        queryKey: ['generatedData'],
        queryFn: getGeneratedData
    });

    const handleTriggerAI = () => {
        setIsConfigOpen(true);
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

    const handleOverlayClose = () => {
        setIsConfigOpen(false);
        document.body.classList.remove('menu-open');
    };

    const handleDelete = () => {
        console.log('Deleting file...');
        setIsResultsOpen(false);
    };

    const handleSave = () => {
        console.log('Saving file...');
        setIsResultsOpen(false);
    };

    const { searchQuery, searchResults, isLoading, error, handleSearch } = useSearch<DataGenerationResponse>({
        data: queriedData || [],
        searchField: 'game',
    });


    const queryClient = useQueryClient();

    const generateMutate = useMutation({
        mutationFn: dataGeneration,
        onMutate: () => {
            setIsRequestLoading(true)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['waitingGames']});
            setResults(data)
            setIsRequestLoading(false)
            setIsResultsOpen(true);
        }
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
                {(isLoading || isLoadingData) && <span className="loading-spinner">⏳</span>}
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
                        <div className="data-table-wrapper">
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th>Challenger</th>
                                    <th>Opponent</th>
                                    <th>Game</th>
                                    <th>Stand</th>
                                </tr>
                                </thead>
                                <tbody>
                                {searchResults.map((item) => (
                                    <tr key={Math.random()} className="data-row">
                                        <td className="item-label">{item.player1}</td>
                                        <td className="item-label">{item.player2}</td>
                                        <td className="item-label">{item.game}</td>
                                        <td className="item-value">{item.wins} - {item.draws} - {item.losses}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            )}

            <footer className="dashboard-footer">
                <button className="trigger-ai-btn" onClick={handleTriggerAI}>
                    Trigger AI vs AI
                </button>
            </footer>
            <AISetupOverlay isOpen={isConfigOpen} onClose={handleOverlayClose} mutate={generateMutate.mutate}/>
            <LoadingOverlay
                isOpen={isRequestLoading}
                message="Generating data..."
            />
            <ResultsOverlay
                isOpen={isResultsOpen}
                onClose={() => setIsResultsOpen(false)}
                results={results}
                onDelete={handleDelete}
                onSave={handleSave}
            />
        </div>

    );
}
