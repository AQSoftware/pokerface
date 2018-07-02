// @flow
import {
  defaultLifeCycle,
  defaultUIBridge,
  CloudStorage,
  MediaStorage
} from 'aq-miniapp-core';
import QueryString from 'query-string';
import View from './views/View';
import Create from './views/Create';
import type {Props as ViewProps} from './views/View';

// const GAME_WIDTH = 528;
// const GAME_HEIGHT = 939;

// const RESOLUTION_SCALE = 1.5;
// const GAME_WIDTH = window.innerWidth * RESOLUTION_SCALE;
// const GAME_HEIGHT = window.innerHeight * RESOLUTION_SCALE;
// const FPS = 30;
//
// const props = {
//   width: GAME_WIDTH,
//   height: GAME_HEIGHT,
//   fps: FPS
// };
//
// const view = new View(props);
// view.start();


// const GAME_WIDTH = 700;
const GAME_HEIGHT = 939;

const RESOLUTION_SCALE = GAME_HEIGHT / window.innerHeight;
const GAME_WIDTH = window.innerWidth * RESOLUTION_SCALE;
// const GAME_HEIGHT = window.innerHeight * RESOLUTION_SCALE;
const FPS = 30;
const DEVT = true;

const credentials = {
  id: 'GQ9JsIkvEeePub7saR1uXQ',
  key: 'ucbYUdautlpg8Ku4K8e9N9S2w0iZcBfe'
}

let _props: ViewProps = {
  app: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    fps: FPS,
    dynamicAssetIndex: Math.floor(Math.random() * 5)
  },
  clients: {
    cloudStorageClient: new CloudStorage(credentials),
    mediaStorageClient: new MediaStorage()
  }
};

defaultLifeCycle.setOnDataCallback(onData);


function onData(data: Object){
  console.log('===== onData');
  _props.data = data;
  // _props.app.width = window.innerWidth * RESOLUTION_SCALE;
  // _props.app.height = window.innerHeight * RESOLUTION_SCALE;
  start();
}

function start(){
  let query = QueryString.parse(window.location.search);
  let view: ?Object = null;

  if (DEVT) {
    view = new View(_props);
  }
  else if (query && query.action) {
    switch (query.action) {
      case 'join':
        if (query.id == null) {
          let message = 'id was not passed for action=join';
          console.error(message);
        }
        else {
          let props = {..._props, id: query.id, mode: 'join'};
          view = new View(props);
        }
        break;
      case 'preview':
        if (_props.data != null){
          let props = {..._props, mode: 'preview'};
          view = new View(props);
        }
        break;
      default:
        let props = {..._props, mode: 'preview'};
        view = new Create(props);
        break;
    }
  }

  if (view){
    view.start();
  }
}

if (DEVT) {
  // onData({});
  onData({
    shouldWin: false,
    winImage: "https://s3.amazonaws.com/bengga-web-funtypes/gift.png"
  });
}