import React from "react"
import appState from "../models/appstate";

export function WorldHeader(props) {

    const handleChangeToken = (e) => {
      e.preventDefault();
      appState.state.token = null;
      appState.updateApp();
    }
  
    return <dl className="row left">
      <dt className="col-sm-3">Token świata</dt>
      <dd className="col-sm-9">
        <b>{appState.state.token}</b>
        <a className="badge badge-success ml-3" href="#" onClick={handleChangeToken}>Zmień</a>
        <a className="badge badge-success ml-3" href="#" onClick={props.handleResetWorld}>Resetuj</a>
      </dd>
      <dt className="col-sm-3">Informacje:</dt>
      <dd className="col-sm-9">
        {props.worldInfo != null ? (
          <table className="table">
            <tr>
              <th>Nazwa świata:</th>
              <td>{props.worldInfo.name}</td>
            </tr>
            <tr>
              <th>Obecna pozycja: </th>
              <td>x={props.worldInfo.current_x}, y={props.worldInfo.current_y}</td>
            </tr>
            <tr>
              <th>Obecne pole:</th>
              <td>{props.worldInfo.field_type}, {props.worldInfo.field_bonus}</td>
            </tr>
            <tr>
              <th>Krok:</th>
              <td>
                {props.worldInfo.step}
                {props.showHistory ?
                  <a className="badge badge-primary ml-3" href="#" onClick={() => {props.cmdShowHistory(false)} }>Zamknij historię</a>
                :
                  <a className="badge badge-primary ml-3" href="#" onClick={() => {props.cmdShowHistory(true)} }>Pokaż historię</a>
                }
              </td>
            </tr>
            <tr>
              <th>Kierunek:</th>
              <td>{props.worldInfo.direction}</td>
            </tr>
            <tr>
              <th>Sesja:</th>
              <td>{props.worldInfo.current_session}</td>
            </tr>
          </table>
        ) : (
            <span>Brak świata o tokenie: {appState.state.token}</span>
          )}
      </dd>
    </dl>
  }