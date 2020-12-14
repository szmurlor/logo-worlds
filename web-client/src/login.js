import React from "react"

import "./login.css"

export function Login() {
    return <div class="login-container"><div class="container">
                <div class="d-flex justify-content-center h-100">
                    <div class="card">
                        <div class="card-header">
                            <h3>Witaj w Logo-Worlds</h3>
                            {
                            /*<div class="d-flex justify-content-end social_icon">
                                <span><i class="fab fa-facebook-square"></i></span>
                                <span><i class="fab fa-google-plus-square"></i></span>
                                <span><i class="fab fa-twitter-square"></i></span>
                            </div>*/
                            }
                        </div>
                        <div class="card-body">
                            <form>
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-user"></i></span>
                                    </div>
                                    <input type="text" class="form-control" placeholder="token świata" />
                                    
                                </div>
                                <div class="form-group">
                                    <input type="submit" value="Graj" class="btn float-right login_btn" />
                                </div>
                            </form>
                        </div>
                        <div class="card-footer">
                            <div class="d-flex justify-content-center links">
                                Wpisz token swojego świata.<br/>
                                To jest gra na przedmiot Podstawy Programowania 2020Z
                            </div>
                            <div class="d-flex justify-content-center">
                                <a target="_blank" href="https://github.com/szmurlor/logo-worlds/wiki/Instrukcja---Podstawy-Programowania---J%C4%99zyk-c">Więcej informacji</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>;
            </div>
}