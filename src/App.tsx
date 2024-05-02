import './scss/style.scss'
import Header from './components/Header/Header.tsx'
import Footer from "./components/Footer/Footer.tsx";
import { LanguageContextProvider } from "./contexts/LanguageContextProvider.tsx";
import {Outlet} from "react-router-dom";
// import {Outlet, useLocation} from "react-router-dom";
// import {useEffect} from "react";

function App() {
    // const {pathname} = useLocation();
    //
    // useEffect(() => {
    //     window.scroll(0, 0);
    //
    // }, {pathname})

    return (
        <>
            <LanguageContextProvider>
                <Header />
                <div className={'main'}>
                    <Outlet />
                </div>
                <Footer />
            </LanguageContextProvider>
        </>
    )
}

export default App
