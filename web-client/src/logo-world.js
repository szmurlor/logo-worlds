import React, { useState, useEffect, useCallback } from "react";
import { Container, Row } from "react-bootstrap";
import { LOGO_WORLDS_URL, TW, BW, BC } from "./config"
import { Button } from "react-bootstrap"
import { Arrow90degLeft, Arrow90degRight, XSquare } from 'react-bootstrap-icons';
import { getInfo, apiCommand, apiCommand2 } from "./apiclient"
import {useMediaQuery} from "react-responsive"
import appState from "./appstate";

var tilesImg = new Image();
tilesImg.src = "/tilesn.png";

var chImg = new Image();
chImg.src = "/tank.png";

function InfoHelp() {
  return <div class="jumbotron">
    <h3 class="display-4">Instrukcja!</h3>
    <p>
      Jesteś operatorem małego czołgu, który jest bardzo zagubiony. Chciałby poznać cały świat,
      w którym się znajduje. Pomóż mu albo za pomocą myszki albo za pomocą klawiszy. Myszką, na tablecie lub smartfonie
      możesz wydawać komendy używając przycisków, na komputerze możesz używać klawiszy kursora:
      <ul>
        <li>'W lewo' - skręć czołg w lewo [klawisz w lewo],</li>
        <li>'Do przodu' - przejdź czołgiem do przodu (będziesz mógł pójść do przodu tylko, jeżeli przed tobą nie znajduje się ściana) [klawisz w góry]</li>,
        <li>'W prawo' - skręć czółg w prawo [klawisz w prawo],</li>
        <li>'Eksploruj z przodu' - wychyl głowę na zwenątrz i sprawdź co jest przed tobą [klawisz w dół].</li>
      </ul>

    Uważaj, każda operacja kosztuje cię energię i czas (tutaj nazywa się to krokiem - <i>ang. step</i>). Nawet wychylenie się i sprawdzenie co jest
    przed tobą zajmuje czas i energię, obracanie, przemieszczanie do przodu. Co więcej, jeżeli wjedziesz na piasek to zużyjesz trzy razy więcej
    energii niż gdybyś jeździł po trawie.
  </p>
    <p class="lead">
      <a class="btn btn-primary btn-lg" target="_blank" href="https://github.com/szmurlor/logo-worlds/wiki/Instrukcja---Podstawy-Programowania---J%C4%99zyk-c" role="button">Więcej informacji</a>
    </p>
  </div>
}

function WorldHeader(props) {

  const handleChangeToken = (e) => {
    e.preventDefault();
    appState.state.token = null;
    appState.updateApp();
  }

  const handleResetWorld = (e) => {
    e.preventDefault();
    apiCommand(appState.state.token, "reset", (json, err) => {
      if (json != null) {
        props.setWorldInfo(json.payload)
      } else 
        console.log(err)
    })
    appState.updateApp();
  }

  return <dl className="row left">
    <dt className="col-sm-3">Token świata</dt>
    <dd className="col-sm-9">
      <b>{appState.state.token}</b>
      <a className="badge badge-success ml-3" href="#" onClick={handleChangeToken}>Zmień</a>
      <a className="badge badge-success ml-3" href="#" onClick={handleResetWorld}>Resetuj</a>
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


function get_initial_board() {
  var a = Array(BW);
  for (var i = 0; i < BW; i++) {
    a[i] = Array(BW);
    a[i].fill("UNKNOWN");
  }

  return a;
}

function Board(props) {
  const [board, setBoard] = useState(get_initial_board);

  const isMobile = useMediaQuery({ maxWidth: 767 })
  var scale = isMobile ? 0.5 : 1.0;

  useEffect(() => {
    if (props.worldInfo != null) {
      board[BW - BC - props.worldInfo.current_y][BC + props.worldInfo.current_x] = props.worldInfo.field_type.toUpperCase();
    }
  })

  const drawTile = (ctx, what, x, y) => {
    var tx, ty
    if (what === "GRASS")
      [tx, ty] = [3, 0]
    else if (what === "UNKNOWN")
      [tx, ty] = [4, 0]
    else if (what === "WALL")
      [tx, ty] = [0, 0]
    else if (what === "SAND")
      [tx, ty] = [2, 0]
    ctx.drawImage(tilesImg, tx * TW, ty * TW, TW, TW, x * TW*scale, y * TW*scale, TW*scale, TW*scale);
  }

  const drawTank = (ctx, x, y, d) => {
    var tx = 0
    if (d === "N")
      tx = 3
    else if (d === "E")
      tx = 0
    else if (d === "S")
      tx = 1
    else if (d === "W")
      tx = 2
    ctx.drawImage(chImg, tx * TW, 0, TW, TW, (BC + x) * TW*scale, (BW - BC - y) * TW*scale, TW*scale, TW*scale);
  }

  const x = props.worldInfo.current_x;
  const y = props.worldInfo.current_y;
  const direction = props.worldInfo.direction;

  useEffect(() => {
    var c = document.getElementById("cboard");
    var ctx = c.getContext('2d');
    var bx, by;
    for (bx = 0; bx < BW; bx++) {
      for (by = 0; by < BW; by++) {
        drawTile(ctx, board[by][bx], bx, by)
      }
    }
    drawTank(ctx, x, y, direction);
  })

  const onRotateClick = (e, direction) => {
    e.preventDefault();

    fetch(`${LOGO_WORLDS_URL}/rotate/${appState.state.token}/${direction}`)
      .then((res) => {
        return res.json();
      }).then((json) => {
        if (json.status === "Success")
          props.setWorldInfo(json.payload);
        else
          props.setWorldInfo(null);
      }).catch((e) => {
        props.setWorldInfo(null);
      });
  };

  const onMoveClick = (e) => {
    e.preventDefault();

    apiCommand(appState.state.token, 'move', (json, err) => {
      if (json != null) {
        props.setWorldInfo(json.payload);
        board[BW - BC - json.payload.current_y][BC + json.payload.current_x] = json.payload.field_type.toUpperCase();
        setBoard({ ...board })
      } else
        console.log("Error: ", err)
    })
  };

  const onExploreClick = (e, direction) => {
    e.preventDefault();
    apiCommand(appState.state.token, 'explore', (json, err) => {
      if (json != null) {
        json.payload.fields.forEach(({ x, y, type }) => {
          board[BW - BC - y][BC + x] = type.toUpperCase();
          setBoard({ ...board })
        });
        props.doRefresh()
      } else
        console.log("Error: ", err)
    })
  }
    
  const handleKeydown = useCallback((e) => {
    if (e.code === 'ArrowUp') {
      e.preventDefault();
      onMoveClick(e);
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      onRotateClick(e, 'left');
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      onRotateClick(e, 'right');
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      onExploreClick(e);
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown])

  return [
    <Row>
      <div className="btn-group" role="group" >
        <Button className="btn btn-primary" onClick={(e) => onRotateClick(e, "left")}><Arrow90degLeft /> W lewo</Button>
        <Button className="btn btn-primary" onClick={(e) => onRotateClick(e, "right")}><Arrow90degRight /> W prawo</Button>
        <Button className="btn btn-secondary" onClick={(e) => onMoveClick(e)}>Do przodu</Button>
        <Button className="btn btn-info" onClick={(e) => onExploreClick(e)}>Exploruj z przodu</Button>
      </div>
    </Row>,
    <Row>
      <canvas id="cboard" width={BW * TW * scale} height={BW * TW * scale}></canvas>
    </Row>
  ];
}


function WorldHistory(props) {

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

export function LogoWorld(props) {
  const [worldInfo, setWorldInfo] = useState(null)
  const [refresh, setRefresh] = useState(1)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    getInfo(appState.state.token, (json, err) => {
      if (json != null)
        setWorldInfo(json.payload);
      else
        setWorldInfo(null);
      setRefresh(refresh + 1)
    })
  }, []);


  const cmdShowHistory = (show) => {
    setShowHistory(show);
  }

  return (
    <Container>
      <Row>
        <InfoHelp />
      </Row>
      <Row>
        <WorldHeader worldInfo={worldInfo} showHistory={showHistory} cmdShowHistory={cmdShowHistory} setWorldInfo={setWorldInfo} />
      </Row>

      { showHistory ?
      <Row>
        <WorldHistory worldInfo={worldInfo} cmdShowHistory={cmdShowHistory} />
      </Row>      
      :
      worldInfo && <Board worldInfo={worldInfo} setWorldInfo={setWorldInfo} doRefresh={() => { setRefresh(refresh + 1) }} />
      }

    </Container>
  );
}
