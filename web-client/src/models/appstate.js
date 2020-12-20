import { BW } from "../config"

class AppState {
    state = {
        token: null
    }

    updateApp = () => {}
}

export function get_initial_board() {
    var a = Array(BW);
    for (var i = 0; i < BW; i++) {
      a[i] = Array(BW);
      a[i].fill("UNKNOWN");
    }
  
    return a;
  }
  

const appState = new AppState();
export default appState;
