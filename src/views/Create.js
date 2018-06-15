// @flow
import Assets, { ASSETS } from '../assets';
import { HexiGroup, HexiButton } from '../components';
import {
  defaultLifeCycle,
  defaultUIBridge,
  CloudStorage,
  MediaStorage
} from 'aq-miniapp-core';
import BackgroundScene from './scenes/BackgroundScene';

const BACKGROUND_COLOR = 0x0;
const BUTTON_WIDTH = 227;
const BUTTON_HEIGHT = 69;

const TITLE = "Where's the smiley?";

export type Props = {
  app: {
    width: number,
    height: number,
    fps: number
  },
  clients: {
    cloudStorageClient: CloudStorage,
    mediaStorageClient: MediaStorage
  }
}

export default class View {

  hexi: any;
  scenes: Array<HexiGroup>;
  doneButton: HexiButton;
  coverImageButton: HexiButton;
  props: Props;
  coverImageUri: ?string;
  backgroundScene: HexiGroup;
  coverImage: Object;

  constructor(props: Props){
    this.props = props;

    this.hexi = window.hexi(props.app.width, props.app.height, this.setup.bind(this), ASSETS, this.load.bind(this));
    this.hexi.fps = props.app.fps;
    this.hexi.backgroundColor = BACKGROUND_COLOR;
    this.hexi.scaleToWindow();

    // Instantiate necessary scenes
    this.scenes = [];

    // this.coverImage
    this.backgroundScene = new BackgroundScene(this.hexi, props.app.width, props.app.height);

    this.doneButton = new HexiButton(this.hexi, BUTTON_WIDTH, BUTTON_HEIGHT, {
      title: 'Done',
      textureAtlas: Assets.textures.button,
      onPress: this._onDone.bind(this)
    });

    this.coverImageButton = new HexiButton(this.hexi, BUTTON_WIDTH, BUTTON_HEIGHT, {
      title: 'Cover',
      textureAtlas: Assets.textures.button,
      onPress: this._onCoverImage.bind(this)
    });

    // Set callback function to be called when AQ app requests to preview the
    // current content of our create screen
    defaultLifeCycle.setRequestPreviewCallback(this._showPreview.bind(this));
    defaultLifeCycle.setPublishCallback(this._publish.bind(this));


  }

  start() {
    this.hexi.start();
  }

  load(){
    this.hexi.loadingBar();
  }

  setup(){
    this.backgroundScene.setup();
    this.doneButton.setup();
    this.coverImageButton.setup();

    this.coverImageButton.scene.setPosition(
      (this.props.app.width - this.coverImageButton.width) / 2.0,
      (this.props.app.height - this.coverImageButton.height - BUTTON_HEIGHT - 10) / 2.0
    )

    this.doneButton.scene.setPosition(
      (this.props.app.width - this.doneButton.width) / 2.0,
      (this.props.app.height - this.doneButton.height + BUTTON_HEIGHT + 10) / 2.0
    )
    // this.hexi.stage.swapChildren(this.backgroundScene.scene, this.button.scene);

    for(let i = 0; i < this.scenes.length; i++){
      this.scenes[i]['scene'].setup();
    }
  }

  _onCoverImage(){
    defaultUIBridge.showGalleryImageSelector('cover', 'Select a cover photo', this._onRequestCoverImage.bind(this));
  }

  _onDone(){
    if (this.coverImageUri) {
      this._showPreview();
    }
  }

  _onRequestCoverImage(key: string, coverImg: string) {
    this.coverImageUri = coverImg;
    const coverImageTexture = window.PIXI.Texture.fromImage(coverImg, false);
    this.coverImage = this.hexi.sprite(coverImageTexture);
    this.coverImage.width = this.props.app.width;
    this.coverImage.height = this.props.app.height;
    this.hexi.stage.swapChildren(this.coverImage, this.doneButton.scene);
  }

  _showPreview() {
    // At the very least, AQ app requires a title and a cover image,
    // before the preview screen can be shown.
    defaultLifeCycle.showPreviewWithData(TITLE, this.coverImageUri, null);
  }

  _publish(id: string) {
    defaultLifeCycle.publishSucceded();
  }
}
