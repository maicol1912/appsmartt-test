import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute, { PublicRoute } from '@/guards/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import { ROUTES } from '@/utils/constants';


import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/dashboard/Dashboard';
import Operations from '@/pages/dashboard/Operations';
import NotFound from '@/pages/NotFound';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route
                            path={ROUTES.LOGIN}
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path={ROUTES.REGISTER}
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path={ROUTES.DASHBOARD}
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Dashboard />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.OPERATIONS}
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Operations />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path={ROUTES.HOME}
                            element={<Navigate to={ROUTES.DASHBOARD} replace />}
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;