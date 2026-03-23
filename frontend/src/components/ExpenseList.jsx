import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('/api/expenses'); // Adjust the endpoint as needed
                setExpenses(response.data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Your Expenses</h2>
            <ul>
                {expenses.map((expense, index) => (
                    <li key={index}>{`Amount: $${expense.amount}`}</li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseList;
