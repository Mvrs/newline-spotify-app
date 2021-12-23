import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { accessToken, getCurrentUserProfile, logout } from "./spotify";
import { catchErrors } from "./utilites";
import "./App.css";

// Scroll to top of page when changing routes
// https://reactrouter.com/web/guides/scroll-restoration/scroll-to-top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    setToken(accessToken)

    const fetchData = async () => {
      try {
        const { data } = await getCurrentUserProfile()
        setProfile(data)

        console.log(data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()

    // or we can wrap it in a HOF with catchErrors
    // I believe it uncessary complicated so leaving it out
    // catchErrors(fetchData())

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8888/login">
            Login in to Spotify
          </a>
        ) : (
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" index element={
                <div>
                  <button onClick={logout}>Log Out</button>

                  {profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <p>{profile.followers.total} Followers</p>
                      {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="Avatar" />
                      )}
                    </div>
                  )}
                </div>}
              />
              <Route path="/top-artists" element={<h1>Top Artists</h1>} />
              <Route path="/top-tracks" element={<h1>Top Tracks</h1>} />
              <Route>
                <Route path="/playlists" element={<h1>All Playlists</h1>} />
                <Route path="/playlists/:id" element={<h1>Playlist</h1>} />
              </Route>
            </Routes>
          </BrowserRouter>
        )}
      </header>
    </div>
  );
}

export default App;
