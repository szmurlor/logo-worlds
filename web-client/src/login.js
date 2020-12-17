import React, { useEffect, useState, useRef } from "react"

import appState from "./appstate"
import "./login.css"
import {getInfo} from "./apiclient"

function TokenField(props) {

    const txtToken = useRef(null)
    useEffect(() => {
        txtToken.current.focus();
    }, [])

    const onTokenChanged = (e) => {
        e.preventDefault();
        var t = e.target.value
        props.setToken(t)

        // getInfo(t, (json, err) => {
        //     if (json != null) {
        //         console.log("Otrzymałem z API: ", json.payload);

        //         props.setError(null);
        //         appState.state.token = t;
        //         appState.updateApp();

        //     } else {
        //         props.setError(err);
        //     }
        // })
    }


    return <div className="input-group form-group">
        <div className="input-group-prepend">
            <span className="input-group-text"><i className="fas fa-user"></i></span>
        </div>
        <input ref={txtToken} type="text" className="form-control" value={props.token}
            onChange={onTokenChanged} placeholder="token świata" />
    </div>;
}

export function Login() {
    var [error, setError] = useState(null);
    var [token, setToken] = useState("");

    const cmdPlay = (e) => {
        e.preventDefault();
        if ((token == null) || (token.length == 0)) {
            setError("Wprowadż właściwy token.")
        } else {
            getInfo(token, (json, err) => {
                if (json != null) {
                    setError(null);
                    appState.state.token = token;
                    appState.updateApp();
                } else {
                    setError(err);
                }
            })
        }
    }

    return <div className="login-container"><div className="container">
        <div className="d-flex justify-content-center h-100">
            <div className="card">
                <div className="card-header">
                    <h3>Witaj w Logo-Worlds</h3>
                    {
                        /*<div class="d-flex justify-content-end social_icon">
                            <span><i class="fab fa-facebook-square"></i></span>
                            <span><i class="fab fa-google-plus-square"></i></span>
                            <span><i class="fab fa-twitter-square"></i></span>
                        </div>*/
                    }
                    { error != null && <p className="login-error">{error}</p>}
                </div>
                <div className="card-body">
                    <form>
                        <TokenField token={token} setToken={setToken} setError={setError}/>
                        <div className="form-group">
                            <input type="submit" onClick={cmdPlay} value="Graj" className="btn float-right login_btn" />
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <div className="d-flex justify-content-center text-center links">
                        Wpisz token swojego świata.<br />
                                To jest gra na przedmiot Podstawy Programowania 2020Z
                            </div>
                    <div className="d-flex justify-content-center">
                        <a target="_blank" href="https://github.com/szmurlor/logo-worlds/wiki/Instrukcja---Podstawy-Programowania---J%C4%99zyk-c">Więcej informacji</a><br/>
                    </div>
                    <div className="d-flex justify-content-end">
                        <span><a target="_blank" href="https://github.com/szmurlor/logo-worlds/wiki/Historia-zmian">v1.1</a></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>;
}