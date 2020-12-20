import React, {useState} from "react"
import {apiCommand2} from "../models/apiclient"
import appState from "../models/appstate"
import { XSquare } from 'react-bootstrap-icons'

export function WorldHistory(props) {

    const [worldSession, setWorldSession] = useState(props.worldInfo.current_session);
    const [worldHistory, setWorldHistory] = useState(null);
  
    const cmdShow = (e) => {
      e.preventDefault();
  
      apiCommand2(appState.state.token, 'history', worldSession, (json, err) => {
        if (json != null) {
          setWorldHistory(json.payload)
        } else
          console.log("Error: ", err)
      })
    }
  
    return <div>
      <h2>Historia</h2>
      <div>
        Sesja: <input type="text" size="40" onChange={(e) => { setWorldSession(e.target.value); }} value={worldSession} />
        <button className="ml-2 btn btn-primary" onClick={cmdShow}>Pokaż</button>
        <button className="ml-2 btn btn-primary" onClick={() => {props.cmdShowHistory(false)}}> <XSquare /> </button>
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
            Brak historii świata o tokenie: {appState.state.token} i sesji: {worldSession}
          </span>
        )}
    </div>
  }