import {LOGO_WORLDS_URL, TW, BW, BC} from "./config"

export function getInfo(worldToken, callback) {
    if (worldToken != null && worldToken.length > 0) {
        fetch(`${LOGO_WORLDS_URL}/info/${worldToken}`)
            .then((res) => {
            return res.json();
            })
            .then((json) => {
                if (json.status === 'Success' )
                callback(json);
                else
                callback(null, "Błąd podczas połączenia z API: " + json.status + " [" + json.error + "]");
            })
            .catch((e) => {
                callback(null, e);
            });
    } else {
        callback(null, "Wprowadź token świata.");
    }
}

export function apiCommand(worldToken, cmd, callback) {
    if (worldToken != null && worldToken.length > 0) {
        fetch(`${LOGO_WORLDS_URL}/${cmd}/${worldToken}`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                if (json.status === 'Success' )
                    callback(json);
                else
                    callback(null, "Błąd podczas połączenia z API: " + json.status + " [" + json.error + "]");
            })
            .catch((e) => {
                callback(null, e);
            });
    } else {
        callback(null, "Wprowadź token świata.");
    }
}

export function apiCommand2(worldToken, cmd, arg, callback) {
    if (worldToken != null && worldToken.length > 0) {
        fetch(`${LOGO_WORLDS_URL}/${cmd}/${worldToken}/${arg}`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                if (json.status === 'Success' )
                    callback(json);
                else
                    callback(null, "Błąd podczas połączenia z API: " + json.status + " [" + json.error + "]");
            })
            .catch((e) => {
                callback(null, e);
            });
    } else {
        callback(null, "Wprowadź token świata.");
    }
}