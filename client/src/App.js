import Hero from "./components/Hero/Hero";
import MapTableToggle from "./components/Visualizations/MapTableToggle";
const code = new URLSearchParams(window.location.search).get("code");
function App() {
    return <>{code ? <MapTableToggle code={code}/> : <Hero />}</>;
}
export default App;
