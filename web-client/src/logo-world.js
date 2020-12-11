import React, { useState, useEffect } from "react";
import { Route, Link } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

function get_initial_array() {
  console.log("Creating initial board.");
  var a = Array(25);
  for (var i = 0; i < 25; i++) {
    a[i] = Array(25);
    a[i].fill(0);
  }
  return a;
}

function Board(props) {
  return (
    <table>
      <tbody>
        {props.board.map((row, idx_row) => {
          return (
            <tr key={idx_row}>
              {row.map((col, idx_col) => {
                if (props.x === idx_col && props.y === 24 - idx_row)
                  return <td key={idx_col}>{props.d}</td>;
                else if (col == -1) return <td key={idx_col}></td>;
                else return <td key={idx_col}>{col}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function LogoWorld(props) {
  const [worldToken, setWorldToken] = useState("");
  const [worldSession, setWorldSession] = useState("");
  const [worldInfo, setWorldInfo] = useState(null);
  const [worldHistory, setWorldHistory] = useState(null);
  const [board, setBoard] = useState(get_initial_array);

  useEffect(() => {
    console.log(worldToken);

    fetch(
      `http://edi.iem.pw.edu.pl:30000/worlds/api/v1/worlds/info/${worldToken}`
    )
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => {
        console.log(json);
        if (json.status === "Success") {
          setWorldInfo(json.payload);
        } else setWorldInfo(null);
      })
      .catch((e) => {
        console.log(e);
        setWorldInfo(null);
      });

    fetch(
      `http://edi.iem.pw.edu.pl:30000/worlds/api/v1/worlds/history/${worldToken}/${worldSession}`
    )
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => {
        console.log(json);
        if (json.status === "Success") setWorldHistory(json.payload);
        else setWorldHistory(null);
      })
      .catch((e) => {
        console.log(e);
        setWorldInfo(null);
      });
  }, [worldToken, worldSession]);

  const onRotateClick = (e, direction) => {
    e.preventDefault();

    fetch(
      `http://edi.iem.pw.edu.pl:30000/worlds/api/v1/worlds/rotate/${worldToken}/${direction}`
    )
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => {
        console.log(json);
        if (json.status === "Success") setWorldInfo(json.payload);
        else setWorldInfo(null);
      })
      .catch((e) => {
        console.log(e);
        setWorldInfo(null);
      });
  };

  const onMoveClick = (e, direction) => {
    e.preventDefault();

    fetch(
      `http://edi.iem.pw.edu.pl:30000/worlds/api/v1/worlds/move/${worldToken}`
    )
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => {
        console.log(json);
        if (json.status === "Success") {
          setWorldInfo(json.payload);
          board[24 - json.payload.current_y][json.payload.current_x] = -1;
        } else setWorldInfo(null);
      })
      .catch((e) => {
        console.log(e);
        setWorldInfo(null);
      });
  };

  return (
    <Container>
      <Row>
        Token:{" "}
        <input
          type="text"
          onChange={(e) => {
            setWorldToken(e.target.value);
          }}
          value={worldToken}
        />
        Sesja:
        <input
          type="text"
          onChange={(e) => {
            setWorldSession(e.target.value);
          }}
          value={worldSession}
        />
      </Row>
      <Row>
        <div>World Info [{worldToken}]</div>
      </Row>
      <Row>
        {worldInfo != null ? (
          <ul>
            <li>Nazwa świata: {worldInfo.name}</li>
            <li>
              Obecna pozycja: {worldInfo.current_x}, {worldInfo.current_x}
            </li>
            <li>
              Obecne pole: {worldInfo.field_type}, {worldInfo.field_bonus}
            </li>
            <li>Krok: {worldInfo.step}</li>
            <li>Kierunek: {worldInfo.direction}</li>
            <li>Sesja: {worldInfo.current_session}</li>
          </ul>
        ) : (
          <span>Brak świata o tokenie: {worldToken}</span>
        )}
      </Row>

      <Row>
        <div>
          Komendy:&nbsp;
          <button onClick={(e) => onRotateClick(e, "right")}>W prawo</button>
          <button onClick={(e) => onRotateClick(e, "left")}>W lewo</button>
          <button onClick={(e) => onMoveClick(e)}>Do przodu</button>
          <button>Exploruj z przodu</button>
        </div>
      </Row>
      <Row>
        <Board
          board={board}
          x={worldInfo == null ? 0 : worldInfo.current_x}
          y={worldInfo == null ? 0 : worldInfo.current_y}
          d={worldInfo == null ? "U" : worldInfo.direction}
        />
      </Row>
      <Row>
        Historia:
        {worldHistory != null ? (
          [
            <ul>
              {worldHistory.history.map((s, idx) => {
                return (
                  <li key={idx}>
                    {s.step}: {s.command} [from host: {s.host} at {s.time}]
                  </li>
                );
              })}
            </ul>
          ]
        ) : (
          <span>
            Brak historii świata o tokenie: {worldToken} i sesji: {worldSession}
          </span>
        )}
      </Row>
    </Container>
  );
}
