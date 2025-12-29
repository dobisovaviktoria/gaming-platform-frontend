import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { useKeycloak } from '../hooks/useKeycloak';

export default function LandingPage() {
    const { login, register } = useKeycloak();

    return (
        <Box className="landing-container">
            <Paper elevation={24} className="landing-card">
                <Box className="landing-content">
                    <Stack spacing={4} alignItems="center">
                        <Typography variant="h2" className="landing-title">
                            BanditGames
                        </Typography>

                        <Typography variant="h5" className="landing-subtitle">
                            The AI-powered board game platform
                        </Typography>

                        <Stack spacing={3} width="100%" maxWidth="sm">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={login}
                                fullWidth
                                className="landing-login-button"
                            >
                                Login
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                onClick={register}
                                fullWidth
                                className="landing-register-button"
                            >
                                Create Account
                            </Button>
                        </Stack>

                        <Typography variant="caption" className="landing-footer">
                            Integration 5 * Applied Computer Science
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}