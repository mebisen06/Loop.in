'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface SocketContextType {
    socket: WebSocket | null;
    isConnected: boolean;
    lastMessage: any | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any | null>(null);

    useEffect(() => {
        if (!user) {
            if (socket) {
                socket.close();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Avoid multiple connections
        if (socket?.readyState === WebSocket.OPEN) return;

        const wsBaseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000';
        const wsUrl = `${wsBaseUrl}/notifications/ws/${user.id}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WS Connected via Context");
            setIsConnected(true);
        };

        ws.onclose = () => {
            console.log("WS Disconnected");
            setIsConnected(false);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLastMessage(data);
            } catch (e) {
                console.error("Failed to parse WS message", e);
            }
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [user]); // Re-connect if user changes

    return (
        <SocketContext.Provider value={{ socket, isConnected, lastMessage }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
