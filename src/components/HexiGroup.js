
/**
HexiGroup - Base class for creating Hexi/Pixi groups
*/
export default class HexiGroup {


  /**
  Constructor

  hexi        - Hexi instance
  width    - Group width
  height   - Group height
  props    - Additional props
  */
  constructor(hexi, width, height, props){
    this.hexi = hexi;
    this.props = props;
    this.width = width;
    this.height = height;
    this.scene = hexi.group();
  }

  /**
  Determines whether the sceen will receive touches. Used primarily
  for enabling/disabling Hexi buttons. See HexiButton.enabled
  */
  get enabled(){
    return this.scene.enabled;
  }

  set enabled(value){
    this.scene.enabled = value;
  }

  /**
  Handles tap gestures on the Pixi canvas.

  The owner of the HexiGroup calls this and allows this HexiGroup
  instance to do some hit testing to see whether the tap gesture is
  relevant.

  Return value - True if gesture is handled, false if not
  */
  onTap(){
    return false;
  }
}
