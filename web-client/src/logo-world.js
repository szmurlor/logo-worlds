import React, { useState, useEffect } from "react";
import { Route, Link } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import {LOGO_WORLDS_URL} from "./config"

var tilesImg = new Image();
tilesImg.src = "/tiles_32.png";

var chImg = new Image();
chImg.src = "/character.png";



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
  useEffect( () => {
    var c = document.getElementById("cboard");
    var ctx = c.getContext('2d');
    var r,c;
    for (r=0;r<25;r++) {
      for (c=0;c<25;c++) {
        if (props.board[c][r] == -1) {
            ctx.drawImage(tilesImg, 3*32,2*32,32,32, r*32, c*32, 32,32);
        }
        if (props.board[c][r] == 0) {
          ctx.drawImage(tilesImg, 6*32,1*32,32,32, r*32, c*32, 32,32);
        }
    }
    }
    ctx.drawImage(chImg, 0, 0, 24, 32, props.x*32, 24*32-props.y*32, 24,24);
  })
  return (
    <canvas id="cboard" width={25*32} height={25*32}></canvas>
    // <table>
    //   <tbody>
    //     {props.board.map((row, idx_row) => {
    //       return (
    //         <tr key={idx_row}>
    //           {row.map((col, idx_col) => {
    //             if (props.x === idx_col && props.y === 24 - idx_row)
    //               return <td key={idx_col}>{props.d}</td>;
    //             else if (col == -1) return <td key={idx_col}></td>;
    //             else return <td key={idx_col}>{col}</td>;
    //           })}
    //         </tr>
    //       );
    //     })}
    //   </tbody>
    // </table>
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

    fetch(`${LOGO_WORLDS_URL}/info/${worldToken}`)
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

    fetch(`${LOGO_WORLDS_URL}/history/${worldToken}/${worldSession}`)
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

    fetch(`${LOGO_WORLDS_URL}/rotate/${worldToken}/${direction}`)
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

    fetch(`${LOGO_WORLDS_URL}/move/${worldToken}`)
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

  useEffect(() => {
    var can = document.getElementById("can");
    var ctx = can.getContext('2d');
    console.log(tilesImg);
    ctx.drawImage(tilesImg, 0,0,64,64, 100,100,64,64);
    console.log(can);
  })

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
      <Row>
        <canvas id="can" width="300" height="300" />
      </Row>
    </Container>
  );
}
