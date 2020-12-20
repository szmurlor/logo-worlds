import React from "react"

export function InfoHelp() {
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