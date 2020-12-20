import React, {useState, useEffect, useCallback} from "react"
import { apiCommand } from "../models/apiclient"
import { LOGO_WORLDS_URL, TW, BW, BC } from "../config"
import { Button } from "react-bootstrap"
import { Arrow90degLeft, Arrow90degRight} from 'react-bootstrap-icons';
import {useMediaQuery} from "react-responsive"
import appState from "../models/appstate"
import { Row } from "react-bootstrap";

var tilesImg = new Image();
tilesImg.src = "/tilesn.png";

var chImg = new Image();
chImg.src = "/tank.png";

export function Board({board, setBoard, ...props}) {
  
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
          json.payload.list.forEach(({ x, y, type }) => {
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
    })
  
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
  
