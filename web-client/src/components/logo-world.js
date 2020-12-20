import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import appState,{get_initial_board} from "../models/appstate";
import {Board} from "./board"
import {WorldHeader} from "./worldheader"
import {WorldHistory} from "./worldhistory"
import {InfoHelp} from "./infohelp"
import {getInfo, apiCommand} from "../models/apiclient"

export function LogoWorld(props) {
  const [worldInfo, setWorldInfo] = useState(null)
  const [refresh, setRefresh] = useState(1)
  const [showHistory, setShowHistory] = useState(false)
  const [board, setBoard] = useState(get_initial_board);

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

  const handleResetWorld = (e) => {
    e.preventDefault();
    apiCommand(appState.state.token, "reset", (json, err) => {
      if (json != null) {
        setWorldInfo(json.payload)
        if (json.status === "Success")
          setBoard(get_initial_board())
      } else 
        console.log(err)
    })
    appState.updateApp();
  }

  return (
    <Container>
      <Row>
        <InfoHelp />
      </Row>
      <Row>
        <WorldHeader worldInfo={worldInfo} showHistory={showHistory} 
        cmdShowHistory={cmdShowHistory} setWorldInfo={setWorldInfo}
        handleResetWorld={handleResetWorld} />
      </Row>

      { showHistory ?
      <Row>
        <WorldHistory worldInfo={worldInfo} cmdShowHistory={cmdShowHistory} />
      </Row>      
      :
      worldInfo && <Board worldInfo={worldInfo} 
      board={board} setBoard={setBoard}
      setWorldInfo={setWorldInfo} 
      doRefresh={() => { setRefresh(refresh + 1) }} />
      }

    </Container>
  );
}
