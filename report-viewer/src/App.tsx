import './App.css'
import Dashboard from "./Dashboard";
import {Container} from "react-bootstrap";

function App() {
    return (
        <>
            <header id="header">
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                    crossOrigin="anonymous"
                />
            </header>

            <Container fluid>
                <Dashboard/>
            </Container>

            <footer id="footer">
                <p>GoodLoad Report Viewer</p>
                <p>Copyright © 2025 GoodLoad</p>
            </footer>
        </>
    )
}

export default App
