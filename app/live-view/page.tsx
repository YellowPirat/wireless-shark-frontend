'use client';

import LiveView from '@/components/LiveView'
import React, { useState, useEffect } from 'react';

export default function Page() {
    const [canSocket, setCanSocket] = useState<string>('')

    useEffect(() => {
        // Aus dem Hash den canSocket extrahieren
        const socket = window.location.hash.replace('#', '')
        setCanSocket(socket)
    }, [])

    useEffect(function mount() {
        function onHashChange() {
            console.log("hashchange!");
            window.location.reload();
        }

        window.addEventListener("hashchange", onHashChange);

        return function unMount() {
            window.removeEventListener("hashchange", onHashChange);
        };
    });

    if (!canSocket) return null



    return <LiveView canSocket={canSocket} />
}