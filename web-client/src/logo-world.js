import React, { useState, useEffect } from "react";
import { Route, Link } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import {LOGO_WORLDS_URL, TW, BW, BC} from "./config"
import {Button} from "react-bootstrap"
import {Arrow90degLeft, Arrow90degRight} from 'react-bootstrap-icons';

var tilesImg = new Image();
tilesImg.src = "/tilesn.png";

var chImg = new Image();
chImg.src = "/tank.png";



function get_initial_board() {
  console.log("Creating initial board.");

  var a = Array(BW);
  for (var i = 0; i < BW; i++) {
    a[i] = Array(BW);
    a[i].fill("UNKNOWN");
  }

  return a;
}

function Board(props) {
  const drawTile = (ctx, what, x, y) => {
    var tx,ty
    if (what === "GRASS") 
      [tx,ty] = [3,0]
    else if (what === "UNKNOWN")
      [tx,ty] = [4,0]
    else if (what === "WALL")
      [tx,ty] = [0,0]
    else if (what === "SAND")
      [tx,ty] = [2,0]
    ctx.drawImage(tilesImg, tx*TW, ty*TW,TW,TW, x*TW, y*TW, TW,TW);
  }

  const drawTank = (ctx, x,y, d) => {
    var tx = 0
    if (d === "N") 
      tx = 3
    else if (d === "E")
      tx = 0
    else if (d === "S") 
      tx = 1
    else if (d === "W")
      tx = 2
    ctx.drawImage(chImg, tx*TW, 0, TW, TW, (BC + x)*TW, (BW-BC-y)*TW, TW,TW);
  }



  useEffect( () => {
    var c = document.getElementById("cboard");
    var ctx = c.getContext('2d');
    var bx,by;
    for (bx=0; bx<BW; bx++) {
      for (by=0; by<BW; by++) {
        drawTile(ctx, props.board[by][bx], bx, by)        
      }
    }
    drawTank(ctx, props.x, props.y, props.direction);
  })
  return (
    <canvas id="cboard" width={BW*TW} height={BW*TW}></canvas>
  );
}

export function LogoWorld(props) {
  const [worldToken, setWorldToken] = useState("");
  const [worldSession, setWorldSession] = useState("");
  const [worldInfo, setWorldInfo] = useState(null);
  const [worldHistory, setWorldHistory] = useState(null);
  const [board, setBoard] = useState(get_initial_board);
  const [refresh, setRefresh] = useState(1);

  
  // tylko jak zmieni się token.
  useEffect(() => {
    console.log(worldToken);

    fetch(`${LOGO_WORLDS_URL}/info/${worldToken}`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.status === "Success") {
          setWorldInfo(json.payload);
        } else 
          setWorldInfo(null);
        setRefresh(refresh+1)
      })
      .catch((e) => {
        setWorldInfo(null);
      });

    if (worldSession != null && worldSession.length > 0) {
      fetch(`${LOGO_WORLDS_URL}/history/${worldToken}/${worldSession}`)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json.status === "Success") 
            setWorldHistory(json.payload);
          else 
            setWorldHistory(null);
        })
        .catch((e) => {
          setWorldInfo(null);
        });
    }
  }, [worldToken, worldSession]);

  useEffect(()=> {
    if (worldInfo != null) {
      board[BW-BC-worldInfo.current_y][BC+worldInfo.current_x] = worldInfo.field_type.toUpperCase();
    }
  })

  const onRotateClick = (e, direction) => {
    e.preventDefault();

    fetch(`${LOGO_WORLDS_URL}/rotate/${worldToken}/${direction}`)
      .then((res) => {
        return res.json();
      }).then((json) => {
        if (json.status === "Success") 
          setWorldInfo(json.payload);
        else 
          setWorldInfo(null);
      }).catch((e) => {
        setWorldInfo(null);
      });
  };

  const onMoveClick = (e, direction) => {
    e.preventDefault();

    fetch(`${LOGO_WORLDS_URL}/move/${worldToken}`)
      .then((res) => {
        return res.json();
      }).then((json) => {
        if (json.status === "Success") {
          setWorldInfo(json.payload);
          board[BW-BC-json.payload.current_y][BC+json.payload.current_x] = json.payload.field_type.toUpperCase();
        } else 
          setWorldInfo(null);
      }).catch((e) => {
        setWorldInfo(null);
      });
  };

  const onExploreClick = (e, direction) => {
    e.preventDefault();

    fetch(`${LOGO_WORLDS_URL}/explore/${worldToken}`)
      .then((res) => {
        return res.json();
      }).then((json) => {
        console.log(json)
        if (json.status === "Success") {
          json.payload.fields.forEach(({x,y,type}) => {
            console.log(type)
            board[BW-BC-y][BC+x] = type.toUpperCase();
          });
          setRefresh(refresh+1)
        } else 
          setWorldInfo(null);
      }).catch((e) => {
        console.log(e)
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
              Obecna pozycja: {worldInfo.current_x}, {worldInfo.current_y}
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
        <div className="btn-group" role="group" >
          <Button className="btn btn-primary" onClick={(e) => onRotateClick(e, "left")}><Arrow90degLeft/> W lewo</Button>
          <Button className="btn btn-secondary" onClick={(e) => onMoveClick(e)}>Do przodu</Button>
          <Button className="btn btn-primary" onClick={(e) => onRotateClick(e, "right")}><Arrow90degRight/> W prawo</Button>
          <Button className="btn btn-info" onClick={(e) => onExploreClick(e)}>Exploruj z przodu</Button>
        </div>
      </Row>
      <Row>
        <Board
          board={board}
          x={worldInfo == null ? 0 : worldInfo.current_x}
          y={worldInfo == null ? 0 : worldInfo.current_y}
          direction={worldInfo == null ? "N" : worldInfo.direction}
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
