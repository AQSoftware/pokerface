// @flow
import { defaultLifeCycle } from 'aq-miniapp-core';

import { HexiGroup, HexiButton } from '../../components';
import Assets, { DynamicAssets, DYNAMIC_ASSETS } from '../../assets';

import TweenMax from '../../libs/gsap/TweenMax.min';
import PixiPlugin from '../../libs/gsap/plugins/PixiPlugin.min';
import { Sine, Back } from '../../libs/gsap/easing/EasePack.min';

type Props = {
  onPress: (void) => void
}

const BUTTON_BOTTOM_PAD = 50;
const BUTTON_WIDTH = 227;
const BUTTON_HEIGHT = 69;

const SpriteHappy = DynamicAssets.images.smileyHappy;
const SpriteSad = DynamicAssets.images.smileySad;

const SORRY_MESSAGES = [
  "Oops.. that's not a smiley",
  "Strike 2...\ndo not disappoint",
  "" // No text. Text in sorry image already
]

const SORRY_BUTTONS = [
  "Try again",
  "Try again",
  "Next"
]

export default class View3 extends HexiGroup {

  setup() {
    this.button = new HexiButton(this.hexi, 227, 69, {
      title: 'Done',
      textureAtlas: Assets.textures.button,
      onPress: this.props.onPress
    });
    this.button.setup();
    this.button.scene.setPosition(
      (this.width - BUTTON_WIDTH) / 2.0,
      (this.height - BUTTON_HEIGHT) - BUTTON_BOTTOM_PAD
    )
    this.scene.addChild(this.button.scene);

    this.center = { x: this.width / 2, y: this.height / 2 };

    this.imageHolder = this.hexi.group();
    this.imageHolder.setPosition(
      this.center.x,
      this.center.y
    );
    this.imageHolder.interactive = true;
    this.imageHolder.on('click', function(){
      this.props._onReset();
    }.bind(this));
    
    this.imageHolder.parent.removeChild(this.imageHolder);
    this.scene.addChild(this.imageHolder);

    this._sceneReset();
  }

  set enabled(value: boolean) {
    super.enabled = value;
    // this.button.enabled = value;

    if (value) {
      this._sceneStart();
    } else {
      this._sceneReset();
    }
  }

  _sceneStart() {
    console.log('RESULT >>> ' + this.result);

    const messageIndex = this.retryCount < SORRY_MESSAGES.length ? this.retryCount : SORRY_MESSAGES.length - 1;
    const buttonIndex = this.result ? SORRY_BUTTONS.length - 1 : messageIndex;

    while (this.imageHolder.children.length > 0) this.imageHolder.removeChildAt(0);
    if (this.button) {
      this.scene.remove(this.button.scene);
    }

    this.button = new HexiButton(this.hexi, 227, 69, {
      title: SORRY_BUTTONS[buttonIndex],
      textureAtlas: Assets.textures.button,
      onPress: this.props.onPress
    });
    this.button.setup();
    this.button.scene.setPosition(
      (this.width - BUTTON_WIDTH) / 2.0,
      (this.height - BUTTON_HEIGHT) - BUTTON_BOTTOM_PAD
    )
    this.scene.addChild(this.button.scene);

    let doBlur = false;
    let image = null;
    // If win, use provided winImage, or default happy smiley
    if (this.result) {
      if (this.props.winImage){
        image = this.props.winImage
      }
      else {
        image = SpriteHappy;
      }
      doBlur = true;
    }
    else {
      // Max retries should use sorry image
      if (buttonIndex === SORRY_BUTTONS.length - 1){
        image = Assets.images.sorry;
        doBlur = true;
      }
      else {
        // Use sad smiley if lose
        image = SpriteSad;
      }
    }

    this.result ? (this.props.winImage ? this.props.winImage : SpriteHappy) : SpriteSad;
    const spriteImage = this.hexi.sprite(image);
    spriteImage.width = 480;
    spriteImage.height = 480;
    spriteImage.setPosition(-spriteImage.width / 2, -spriteImage.height / 2);
    this.imageHolder.addChild(spriteImage);

    const message = this.result ? (this.props.winImage ? 'You won a gift!' : "CONGRATS!") : SORRY_MESSAGES[messageIndex];
    const title = this.hexi.text(message);
    title.style = { fontFamily: "Futura", fontSize: "40px", align: 'center' };
    title.setPosition(-title.width / 2, -spriteImage.height / 2 - title.height * 1);
    this.imageHolder.addChild(title);

    this.imageHolder.position.y = this.center.y + 50;
    TweenMax.to(this.imageHolder, .2, { pixi: { y: this.center.y, scaleX: 1, scaleY: 1 }, ease: Back.easeOut });
    TweenMax.to(this.imageHolder, .3, { pixi: { alpha: 1 }, ease: Sine.easeOut });

    if (doBlur) {
      this.scene.removeChild(this.button.scene);

      setTimeout(() => {
        var filter = new PIXI.filters.BlurFilter(0, 3);
        filter.blur = 0;
        this.scene.parent.filters = [filter];
        // window.lastSceneParent = this.scene.parent;
        // window.lastSceneParent.aaaaaaaaaa___THIS = "THIS!!!!!";
        TweenMax.to(filter, 1.5, { blur: 10, ease: Power3.easeInOut });

        defaultLifeCycle.end();
      }, 5 * 1000);
    } else {
      setTimeout(() => {
        defaultLifeCycle.end();
      }, 5 * 1000);
    }
  }

  _sceneReset() {
    this.result = false;
    TweenMax.killTweensOf(this.imageHolder);
    TweenMax.set(this.imageHolder, { pixi: { alpha: 0, scaleX: 0, scaleY: 0 } });
  }

}
