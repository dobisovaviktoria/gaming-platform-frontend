import {useState} from 'react';
import {Box, Typography, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from "../../components/Navbar.tsx";
import SideMenu from "../../components/overlays/SideMenu.tsx";
import AISetupOverlay from "../../components/overlays/AISetupOverlay.tsx";
import LoadingOverlay from "../../components/overlays/LoadingOverlay.tsx";
import ResultsOverlay from "../../components/overlays/ResultsOverlay.tsx";
import {useSearch} from "../../hooks/useSearch.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {postGeneratedData, getGeneratedData, deleteGeneratedData} from "../../services/game.ts";
import type {DataGenerationResponse} from "../../model/types.ts";

export default function AdminDashboardPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState(false);

    const [results, setResults] = useState<DataGenerationResponse>({
        file: "",
        game: "",
        wins: 0,
        draws: 0,
        losses: 0,
    });

    const queryClient = useQueryClient();

    const {data: queriedData, isLoading: isLoadingData} = useQuery<DataGenerationResponse[], Error>({
        queryKey: ['generatedData'],
        queryFn: getGeneratedData,
    });

    const {searchQuery, searchResults, handleSearch} = useSearch<DataGenerationResponse>({
        data: queriedData || [],
        searchField: 'game',
    });

    const generateMutate = useMutation({
        mutationFn: postGeneratedData,
        onMutate: () => setIsRequestLoading(true),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['generatedData'] });
            setResults(data);
            setIsRequestLoading(false);
            setIsResultsOpen(true);
        },
    });

    const deleteMutate = useMutation({
        mutationFn: deleteGeneratedData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generatedData'] });
        },
    });

    const handleTriggerAI = () => setIsConfigOpen(true);

    const handleMenuToggle = () => {
        setIsMenuOpen(prev => {
            const newState = !prev;
            document.body.classList.toggle('menu-open', newState);
            return newState;
        });
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    const handleOverlayClose = () => {
        setIsConfigOpen(false);
        document.body.classList.remove('menu-open');
    };

    const handleDataClick = (data: DataGenerationResponse) => {
        setResults(data);
        setIsResultsOpen(true);
    };

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0;

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <Box p={4} className="admin-dashboard-content">
                <Box mb={5} position="relative">
                    <TextField
                        fullWidth
                        placeholder="Search games..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        autoFocus
                        className="admin-search-field"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    {(isLoadingData || generateMutate.isPending) && (
                        <Box className="search-loading-indicator">
                            <CircularProgress size={28} thickness={4} />
                        </Box>
                    )}
                </Box>

                <Typography variant="h4" gutterBottom className="admin-page-title">
                    Data
                </Typography>

                {showNoResults && (
                    <Box textAlign="center" my={12} className="no-results-container">
                        <Typography variant="h5" className="no-results-title">
                            No results found
                        </Typography>
                        <Typography color="text.secondary" mt={2}>
                            Try a different search term.
                        </Typography>
                    </Box>
                )}

                {searchResults.length > 0 && (
                    <TableContainer component={Paper} className="admin-data-table-container">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="table-header-cell">Game</TableCell>
                                    <TableCell align="center" className="table-header-cell">
                                        Wins & Losses
                                    </TableCell>
                                    <TableCell align="center" className="table-header-cell">
                                        Draws
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchResults.map((item) => (
                                    <TableRow
                                        key={item.file}
                                        hover
                                        onClick={() => handleDataClick(item)}
                                        className="admin-data-row"
                                    >
                                        <TableCell className="table-body-cell">{item.game}</TableCell>
                                        <TableCell align="center" className="table-body-cell">
                                            {item.wins + item.losses}
                                        </TableCell>
                                        <TableCell align="center" className="table-body-cell">
                                            {item.draws}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Box mt={8} display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                        variant="outlined"
                        size="large"
                        component="a"
                        href="http://localhost:8000/analysis/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Live Monitoring
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleTriggerAI}
                        className="trigger-ai-button"
                    >
                        Trigger AI vs AI
                    </Button>
                </Box>
            </Box>

            <AISetupOverlay
                isOpen={isConfigOpen}
                onClose={handleOverlayClose}
                mutate={generateMutate.mutate}
            />
            <LoadingOverlay isOpen={isRequestLoading} message="Generating data..." />
            <ResultsOverlay
                isOpen={isResultsOpen}
                onClose={() => setIsResultsOpen(false)}
                results={results}
                onDelete={(file: string) => deleteMutate.mutate(file)}
                onSave={() => console.log('Saving file...')}
            />
        </Box>
    );
}