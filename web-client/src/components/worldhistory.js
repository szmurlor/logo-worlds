import React, { useEffect, useState } from "react";
import { apiCommand, apiCommand2 } from "../models/apiclient";
import appState from "../models/appstate";
import { XSquare } from "react-bootstrap-icons";

export function WorldHistory(props) {
  const [worldSession, setWorldSession] = useState(
    props.worldInfo.current_session
  );
  const [worldHistory, setWorldHistory] = useState(null);

  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    apiCommand(appState.state.token, "sessions", (json, err) => {
      if (json != null) {
          console.log(json.payload)
        setSessions(json.payload.sessions);
      } else console.log("Error: ", err);
    });
  }, []);

  const cmdShow = (e) => {
    e.preventDefault();

    apiCommand2(appState.state.token, "history", worldSession, (json, err) => {
      if (json != null) {
        setWorldHistory(json.payload);
      } else console.log("Error: ", err);
    });
  };

  return (
    <div>
      <h2>Historia</h2>
      <div>
        Sesja:
        <select
          class="form-control"
          onChange={(e) => {
            console.log("Wybrana sesja: ", e.target.value);
            setWorldSession(e.target.value);
          }}
          value={worldSession}
        >
          {sessions.map((s, idx) => (
            <option key={idx}>{s}</option>
          ))}
        </select>
        <button className="ml-2 btn btn-primary" onClick={cmdShow}>
          Pokaż
        </button>
        <button
          className="ml-2 btn btn-primary"
          onClick={() => {
            props.cmdShowHistory(false);
          }}
        >
          {" "}
          <XSquare />{" "}
        </button>
      </div>

      {worldHistory != null ? (
        <table className="table">
          <thead>
            <tr>
              <th>Krok</th>
              <th>Komenda</th>
              <th>Host</th>
              <th>Czas zapytania</th>
            </tr>
          </thead>
          <tbody>
            {worldHistory.history.map((s, idx) => {
              return (
                <tr key={idx}>
                  <th>{s.step}</th>
                  <td>{s.command}</td>
                  <td>{s.host}</td>
                  <td>{s.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <span>
          Brak historii świata o tokenie: {appState.state.token} i sesji:{" "}
          {worldSession}
        </span>
      )}
    </div>
  );
}
