import { useEffect, useState } from 'react';
import ExampleComponent from '../components/ExampleComponent';
import { fetchExampleData } from '../api/exampleService';
import { formatDate } from '../utils/formatters';

const Home = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchExampleData();
                setData(result);
            } catch (error) {
                // Handle error
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="page-container">
            <h1>Home Page</h1>
            <p>Today is: {formatDate(new Date())}</p>

            <section>
                <h2>Example Component Usage</h2>
                <ExampleComponent
                    title="Welcome to the New Structure"
                    description="This component demonstrates how to organize your files."
                />
            </section>

            <section>
                <h2>API Data Example</h2>
                {loading ? (
                    <p>Loading data...</p>
                ) : data ? (
                    <div className="card">
                        <h3>Data from API:</h3>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                ) : (
                    <p>Failed to load data.</p>
                )}
            </section>
        </div>
    );
};

export default Home;
