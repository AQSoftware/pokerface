// @flow
import { HexiGroup, HexiButton, SmileysMoving } from '../../components';
import Assets, { DynamicAssets, DYNAMIC_ASSETS } from '../../assets';

import TweenMax from '../../libs/gsap/TweenMax.min';
import PixiPlugin from '../../libs/gsap/plugins/PixiPlugin.min';
import { Sine } from '../../libs/gsap/easing/EasePack.min';

type Props = {
  onPress: (void) => void, 
  itemsPerRow: Number
}

export default class View2 extends HexiGroup {
  setup() {
    this.itemsContainer = null;
    this.smileys = new SmileysMoving(this.hexi, {
      width: this.width,
      height: this.height,
      onSmileyPress: this.props.onSmileyPress,
      itemsPerRow: 5
    });
    this.bgmusic = PIXI.sound.Sound.from(Assets.sounds.bgmusic);
  }

  set enabled(value: boolean) {
    super.enabled = value;
    if (value) {
      this.hexi.stage.addChild(this.smileys.scene);
      this.bgmusic.stop();
    } else {
      this.hexi.stage.removeChild(this.smileys.scene);
    }
    // this.smileys.scene.visible = value;

    if (value) {
      this._sceneStart();
    } else {
      this._sceneReset();
    }
  }

  _sceneStart() {
    this.smileys.generateSmilies();
    this.smileys.start();
    this.bgmusic.play({
      loop: true
    });
  }

  _sceneReset() {
    this.smileys.stop();
    this.smileys.disposeSmilies();
    this.bgmusic.stop();
  }

  sceneStop() {
    this.smileys.stop();
  }
}
