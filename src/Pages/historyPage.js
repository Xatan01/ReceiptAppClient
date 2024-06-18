import React, { useEffect, useState } from 'react';
import './historyPage.css';

export default function HistoryPage() {
    const [scanHistory, setScanHistory] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/history');
                const data = await response.json();
                // Sort the data by createdAt in descending order
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                console.log(sortedData); // Log the data to check the s3Url
                setScanHistory(sortedData);
            } catch (error) {
                console.error("Error fetching scan history:", error);
                setErrorMessage("Failed to retrieve scan history. Please try again.");
            }
        };

        fetchHistory();
    }, []);

    const handleSelectItem = (id) => {
        setSelectedItems(prev => {
            const newSelectedItems = new Set(prev);
            if (newSelectedItems.has(id)) {
                newSelectedItems.delete(id);
            } else {
                newSelectedItems.add(id);
            }
            return newSelectedItems;
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(scanHistory.map(scan => scan.id)));
        }
        setSelectAll(!selectAll);
    };

    const handleClearSelected = async () => {
        const itemsToDelete = Array.from(selectedItems).map(id => {
            const item = scanHistory.find(scan => scan.id === id);
            return { id: item.id, createdAt: item.createdAt };
        });

        try {
            const response = await fetch('http://localhost:5000/api/deleteSelected', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: itemsToDelete })
            });

            if (response.ok) {
                setScanHistory(prev => prev.filter(scan => !selectedItems.has(scan.id)));
                setSelectedItems(new Set());
                setSelectAll(false);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || "Failed to delete selected scans. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting selected scans:", error);
            setErrorMessage("Failed to delete selected scans. Please try again.");
        }
    };

    return (
        <div className="history-container">
            <h3 className="history-title">Scan History</h3>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="history-controls">
                <button onClick={handleSelectAll}>
                    {selectAll ? 'Deselect All' : 'Select All'}
                </button>
                <button onClick={handleClearSelected} disabled={selectedItems.size === 0}>
                    Clear Selected
                </button>
            </div>
            <ul className="history-list">
                {scanHistory.map((scan) => (
                    <li key={scan.id} className="history-item">
                        <div className="history-item-details">
                            <div className="history-item-header">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.has(scan.id)}
                                    onChange={() => handleSelectItem(scan.id)}
                                />
                                <div className="history-item-header-right">
                                    <button onClick={() => handleSelectItem(scan.id)}>
                                        {selectedItems.has(scan.id) ? 'Deselect' : 'Select'}
                                    </button>
                                </div>
                            </div>
                            <p><strong>File Name:</strong> {scan.fileName}</p>
                            <p><strong>Date:</strong> {new Date(scan.createdAt).toLocaleString()}</p>
                            <div className="scan-results">
                                <div>
                                    <h4>Textract Results:</h4>
                                    <p><strong>Invoice Date:</strong> {scan.textractResult.invoiceDate}</p>
                                    <p><strong>Invoice Number:</strong> {scan.textractResult.invoiceNumber}</p>
                                    <p><strong>Total Amount:</strong> {scan.textractResult.totalAmount}</p>
                                    <p><strong>Classification:</strong> {scan.textractResult.classification}</p>
                                </div>
                                <div>
                                    <h4>OpenAI Results:</h4>
                                    <p><strong>Invoice Date:</strong> {scan.openaiResult.invoiceDate}</p>
                                    <p><strong>Invoice Number:</strong> {scan.openaiResult.invoiceNumber}</p>
                                    <p><strong>Total Amount:</strong> {scan.openaiResult.totalAmount}</p>
                                    <p><strong>Classification:</strong> {scan.openaiResult.classification}</p>
                                </div>
                            </div>
                        </div>
                        <img src={scan.s3Url} alt={scan.fileName} className="scan-image" />
                    </li>
                ))}
            </ul>
        </div>
    );
}
