import React, { useEffect, useState } from 'react';
import './historyPage.css';

export default function HistoryPage() {
    const [scanHistory, setScanHistory] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/history');
                const data = await response.json();
                setScanHistory(data);
            } catch (error) {
                console.error("Error fetching scan history:", error);
                setErrorMessage("Failed to retrieve scan history. Please try again.");
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="history-container">
            <h3 className="history-title">Scan History</h3>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <ul className="history-list">
                {scanHistory.map((scan) => (
                    <li key={scan.id} className="history-item">
                        <p><strong>File Name:</strong> {scan.fileName}</p>
                        <p><strong>Invoice Date:</strong> {scan.invoiceDate}</p>
                        <p><strong>Invoice Number:</strong> {scan.invoiceNumber}</p>
                        <p><strong>Total Amount:</strong> {scan.totalAmount}</p>
                        <p><strong>Classification:</strong> {scan.classification}</p>
                        <p><strong>Date:</strong> {new Date(scan.createdAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
