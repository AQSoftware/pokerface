// @flow
import Assets, { ASSETS, DYNAMIC_ASSETS, DynamicAssets } from '../assets';
import HexiGroup from '../components';
import {
  LifeCycle, WinCriteriaEnum,
  Utils
} from 'aq-miniapp-core';
import {
  BackgroundScene,
  View1, View2, View3
} from './scenes';
import bg from '../assets/images/background.jpg';

const BACKGROUND_COLOR = 0xCCCCCC;
const MAX_RETRIES = 1;

const JOIN_IMAGE = "https://s3.amazonaws.com/famers/720/F424114282225X1UMPV.jpg";

export type Props = {
  app: {
    width: number,
    height: number,
    fps: number,
    dynamicAssetIndex: number
  },
  data?: {
    shouldWin: boolean,
    winImage?: string
  }
}

export default class View {

  hexi: any;
  scenes: Array<HexiGroup>;
  pageNumber: number;
  backgroundScene: HexiGroup;
  currentScene: ?HexiGroup;
  retryCount: number;
  isWin: boolean;

  constructor(props: Props) {
    // Build array of assets to be used. Merge common assets with dynamic assets
    let thingsToLoad = ASSETS.concat(DYNAMIC_ASSETS);
    // console.dir(thingsToLoad);
    // console.dir(DynamicAssets);

    if (props.data && props.data.shouldWin && props.data.winImage) {
      thingsToLoad.push(props.data.winImage);
    }

    this.hexi = window.hexi(props.app.width, props.app.height, this.setup.bind(this), thingsToLoad, this.load.bind(this));
    this.hexi.fps = props.app.fps;
    this.hexi.backgroundColor = BACKGROUND_COLOR;
    this.hexi.scaleToWindow();

    // turn this Smoothie stuff off
    this.hexi.smoothie.interpolate = false;

    this.scenes = [];
    // Instantiate background scene
    this.backgroundScene = new BackgroundScene(this.hexi, props.app.width, props.app.height);

    // Instantiate view scenes
    this.scenes.push({
      name: 'view1', scene: new View1(this.hexi, props.app.width, props.app.height, {
        onPress: this._onView1Click.bind(this)
      })
    });
    this.scenes.push({
      name: 'view2', scene: new View2(this.hexi, props.app.width, props.app.height, {
        onPress: this._onView2Click.bind(this),
        onSmileyPress: this._onSmileyPress.bind(this)
      })
    });
    const winImage = props.data ? props.data.winImage : null;
    this.scenes.push({
      name: 'view3', scene: new View3(this.hexi, props.app.width, props.app.height, {
        winImage: winImage,
        onPress: this._onView3Click.bind(this),
        _onReset: this.onReset.bind(this)
      })
    });

    LifeCycle.setOnResetCallback(this.onReset.bind(this));
    LifeCycle.setAppData({backgroundImage: `${Utils.relativeToAbsolutePath(bg)}`});

    this.retryCount = 0;
  }

  onReset(data: Object){
    console.log('***** onReset');
    this.backgroundScene.showBackground(1);
    this.isWin = false;
    this.retryCount = 0;
    this._setPage(0);
    LifeCycle.informLoaded();
  }

  start() {
    this.hexi.start();
  }

  /**
  Loading function to load assets
  */
  load() {
    // this.hexi.loadingBar();
  }

  /**
  Setup function to setup scenes
  */
  setup() {
    this.backgroundScene.setup();
    this.backgroundScene.showBackground(1);
    for (let i = 0; i < this.scenes.length; i++) {
      this.scenes[i]['scene'].setup();
    }
    this._setPage(0);
    LifeCycle.informReady();
  }

  _setPage(page: number) {
    // console.log('################ setPage '+page);
    // console.log('window.lastSceneParent == ', window.lastSceneParent);
    // if(window.lastSceneParent) window.lastSceneParent.filters = [];
    this.pageNumber = page;
    this._updateScene();
  }

  _updateScene() {
    for (let i = 0; i < this.scenes.length; i++) {
      this.scenes[i]['scene'].scene.visible = i === this.pageNumber;
      this.scenes[i]['scene'].enabled = i === this.pageNumber;
    }
  }

  _onView1Click() {
    this.blockMultClicks(function () {

      this._setPage(1);
      this.backgroundScene.showBackground(0);
      LifeCycle.start();

    }.bind(this));
  }

  _onView2Click() {
    this.blockMultClicks(function () {

      this.backgroundScene.showBackground(2);
      this._setPage(2);

    }.bind(this));
  }

  _onView3Click() {
    this.blockMultClicks(function () {

      if (!this.isWin && this.retryCount < MAX_RETRIES) {
        this.backgroundScene.showBackground(0);
        this._setPage(1);
      }
      else {
        this.backgroundScene.showBackground(2);
        LifeCycle.end();
      }

    }.bind(this));
  }

  blockMultClicks(callback) {
    window.lastClickTime = window.lastClickTime || 0;
    var clickTime = new Date().getTime();
    if (clickTime - window.lastClickTime > 500) {
      window.lastClickTime = clickTime;
      callback();
    }
  }

  _onSmileyPress(isWin: boolean, isTimeout: boolean) {
    this.backgroundScene.showBackground(2);
    this.isWin = isWin;
    if (isTimeout) {
      this.retryCount = MAX_RETRIES - 1;
    }
    const param = {
      winCriteria: isWin ? WinCriteriaEnum.Win : WinCriteriaEnum.Lose,
      resultImageUrl: JOIN_IMAGE,
      score: {
        value: 0
      }
    }
    if (this.isWin) {
      LifeCycle.setResult(param);
      this.scenes[1]['scene'].sceneStop();
    }
    else {
      this.retryCount += 1;
      if (this.retryCount >= MAX_RETRIES) {
        LifeCycle.setResult(param);
      }
    }

    this.scenes[2]['scene'].result = isWin;
    this.scenes[2]['scene'].retryCount = this.retryCount - 1;
    this.scenes[2]['scene'].maxRetries = MAX_RETRIES;
    this._setPage(2);
  }
}
