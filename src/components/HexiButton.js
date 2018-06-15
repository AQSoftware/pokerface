// @flow
import HexiGroup from './HexiGroup';

type Props = {
  title: string,
  textureAtlas: string,
  onPress: (void) => void,
  onOver?: (void) => void,
  onOut?: (void) => void,
  onTap?: (void) => void,
}

export default class HexiButton extends HexiGroup {
  setup() {
    let textures = window.PIXI.loader.resources[this.props.textureAtlas].textures;
    this.button = this.hexi.button([
      textures[0],
      textures[1],
      textures[2]
    ]);
    this.button.width = this.width;
    this.button.height = this.height;
    // this.button.press = this.props.onPress;
    this.button.release = this.props.onPress;
    if (this.props.onOver) this.button.over = this.props.onOver;
    if (this.props.onOut) this.button.out = this.props.onOut;
    if (this.props.onTap) this.button.tap = this.props.onTap;
    this.scene.addChild(this.button);

    this.title = this.hexi.text(this.props.title.toUpperCase());
    this.title.style = { fontFamily: "Futura", fontSize: "30px", align: 'center' };
    this.title.setPosition((this.width - this.title.width) / 2, (this.height - this.title.height) / 2);
    this.scene.addChild(this.title);

  }

  get enabled(): boolean {
    return this.button.enabled;
  }

  set enabled(value: boolean) {
    this.button.enabled = value;
  }
}
