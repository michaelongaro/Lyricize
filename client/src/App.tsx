import AnimatedStarBackground from "./components/AnimatedStarBackground/AnimatedStarBackground";
import Hero from "./components/Hero/Hero";
import MapTableToggle from "./components/Visualizations/MapTableToggle";

const code = new URLSearchParams(window.location.search).get("code");
const userIDBeingSearched = new URLSearchParams(window.location.search).get(
  "user"
);

function App() {
  return (
    <>
      <AnimatedStarBackground />
      {code || userIDBeingSearched ? (
        <>
          {code && <MapTableToggle code={code} />}

          {userIDBeingSearched && (
            <MapTableToggle userIDBeingSearched={userIDBeingSearched} />
          )}
        </>
      ) : (
        <Hero />
      )}
    </>
  );
}

export default App;
