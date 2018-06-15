import { HexiGroup } from '../../components';
import Assets from '../../assets';

export default class BackgroundScene extends HexiGroup {

  setup(){
    this.backgroundClear = this.hexi.sprite(Assets.images.backgroundClear);
    this.backgroundClear.width = this.width;
    this.backgroundClear.height = this.height;
    this.backgroundClear.setPosition(0,0);
    this.scene.addChild(this.backgroundClear);

    this.background = this.hexi.sprite(Assets.images.background);
    this.background.width = this.width;
    this.background.height = this.height;
    this.background.setPosition(0,0);
    this.scene.addChild(this.background);

    this.background2 = this.hexi.sprite(Assets.images.background2);
    this.background2.width = this.width;
    this.background2.height = this.height;
    this.background2.setPosition(0,0);
    this.scene.addChild(this.background2);

  }

  showBackground(index) {
    switch (index) {
      case 0:
        this.background.visible = false;
        this.background2.visible = false;
        this.backgroundClear.visible = true;
        break;
      case 1:
        this.background.visible = true;
        this.background2.visible = false;
        this.backgroundClear.visible = false;
        break;
      default:
        this.background.visible = false;
        this.background2.visible = true;
        this.backgroundClear.visible = false;
    }
  }

}
