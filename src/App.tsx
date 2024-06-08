import ChatBase from "./components/Chats/ChatBase";
import Header from "./components/Header";
import Layout from "./components/Layout";

function App() {
    return (
        <>
            <Header />

            <Layout>
                <ChatBase />
            </Layout>
        </>
    );
}

export default App;
