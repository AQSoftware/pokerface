// @flow
import { HexiGroup, HexiButton } from '../../components';
import Assets, { DYNAMIC_ASSETS, ASSETS } from '../../assets';
import fitObject from '../../libs/Utils';
import 'pixi-sound';

import TweenMax from '../../libs/gsap/TweenMax.min';
import PixiPlugin from '../../libs/gsap/plugins/PixiPlugin.min';
import { Sine } from '../../libs/gsap/easing/EasePack.min';

type Props = {
  onPress: (void) => void
}

const BUTTON_BOTTOM_PAD = 50;
const BUTTON_WIDTH = 227;
const BUTTON_HEIGHT = 69;

const BUBBLE_SCALE = .7;

export default class View1 extends HexiGroup {

  setup() {
    this.button = new HexiButton(this.hexi, 227, 69, {
      title: 'Tap to start',
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

    const WELCOME_PAD_X = this.width * .025;
    const WELCOME_PAD_Y = BUTTON_BOTTOM_PAD;

    this.welcomeGraphics = new PIXI.Container();
    let lastY = 0;

    this.bubble1 = PIXI.Sprite.fromImage(Assets.images.bubbleLeft);
    this.bubble1.pivot.x = 170;
    this.bubble1.pivot.y = this.bubble1.height;
    this.bubble1.x = -400;
    this.bubble1.scale.set(BUBBLE_SCALE);
    this.bubble1.y = this.bubble1.height + 70;
    // this.bubble1.rotation = -0.5;

    this.bubble2 = PIXI.Sprite.fromImage(Assets.images.bubbleRight);
    this.bubble2.pivot.x = -10;
    this.bubble2.pivot.y = this.bubble1.height;
    this.bubble2.x = 60;
    this.bubble2.scale.set(BUBBLE_SCALE);
    this.bubble2.y = this.bubble1.height + 40;
    // this.bubble2.rotation = 0.5;

    this.title1 = new PIXI.Text("Find me!",
      new PIXI.TextStyle({ fontFamily: "Futura", fontSize: "160px", fill: ['#ffffff'], align: 'center' }));
    this.title1.x = (this.bubble1.width / this.bubble1.scale.x - this.title1.width) / 2;// mult by scale to compensate until first render
    this.title1.y = 180;
    this.bubble1.addChild(this.title1);

    this.title2 = new PIXI.Text("Then\ntap me",
      new PIXI.TextStyle({ fontFamily: "Futura", fontSize: "100px", fill: ['#ffffff'], align: 'center' }));
    this.title2.x = (this.bubble2.width / this.bubble2.scale.x - this.title2.width) / 2;// mult by scale to compensate until first render
    this.title2.y = 100;
    this.bubble2.addChild(this.title2);

    this.welcomeGraphics.addChild(this.bubble1);
    this.welcomeGraphics.addChild(this.bubble2);

    lastY += this.bubble1.height;

    this.image = PIXI.Sprite.fromImage(DYNAMIC_ASSETS[0]);
    this.image.pivot.set(this.image.width / 2);
    this.image.x = 0;
    this.image.y = lastY + this.image.height / 2;
    this.image.origY = this.image.y; // save for later tweening
    // this.image.scale.set(0.1);
    this.welcomeGraphics.addChild(this.image);

    // this.arrow = new PIXI.Sprite.fromImage(Assets.images.arrow);
    // this.arrow.width = 180;
    // this.arrow.height = 180;
    // this.arrow.x = 220;
    // this.arrow.y = 550;
    // this.scene.addChild(this.arrow);

    const availY = this.button.scene.y - BUTTON_BOTTOM_PAD;// calc available Y space
    fitObject(this.welcomeGraphics,
      this.width - WELCOME_PAD_X * 2,
      availY - WELCOME_PAD_Y * 2
    );

    // center
    this.welcomeGraphics.x = this.center.x;
    this.welcomeGraphics.y = (availY - this.welcomeGraphics.height) / 2;

    // sound
    this.popSound = PIXI.sound.Sound.from(Assets.sounds.pop);
    this.scene.addChild(this.welcomeGraphics);
    this._sceneReset();
  }

  set enabled(value: boolean) {
    super.enabled = value;
    this.button.enabled = value;

    if (value) {
      this._sceneStart();
    } else {
      this._sceneReset();
    }
  }

  _sceneStart() {
    setTimeout(() => {
      this.image.position.y = this.image.origY + 50;
      TweenMax.to(this.image, .5, { pixi: { alpha: 1, y: this.image.origY, scaleX: 1, scaleY: 1 }, ease: Sine.easeOut });
      TweenMax.to(this.bubble1, .25, { pixi: { alpha: 1, scaleX: BUBBLE_SCALE, scaleY: BUBBLE_SCALE }, delay: .3, ease: Back.easeOut });
      TweenMax.to(this.bubble2, .25, { pixi: { alpha: 1, scaleX: BUBBLE_SCALE, scaleY: BUBBLE_SCALE }, delay: .3, ease: Back.easeOut });
      this.popSound.play();
    }, 800);    
  }

  _sceneReset() {
    TweenMax.killTweensOf(this.image);
    TweenMax.set(this.image, { pixi: { alpha: 0, scaleX: .95, scaleY: .95 } });
    this.bubble1.scale.x = this.bubble1.scale.y = BUBBLE_SCALE * .6;
    this.bubble1.alpha = 0;
    this.bubble2.scale.x = this.bubble2.scale.y = BUBBLE_SCALE * .6;
    this.bubble2.alpha = 0;
  }
}
