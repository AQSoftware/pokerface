//@flow
import arrow from './images/arrow.png';
import background from './images/background.jpg';
import background2 from './images/background2.jpg';
import backgroundClear from './images/background-clear.jpg';
import sorry from './images/sorry.png';

import button from './textures/button.json';

import smileyHappy from './images/emoji-1.png';
import smileySad from './images/emoji-2.png';
import bubbleLeft from './images/bubble-left.png';
import bubbleRight from './images/bubble-right.png';

import bgmusic from './sounds/Funky_Sting.mp3';
import lose from './sounds/lose.mp3';
import pop from './sounds/pop.mp3';
import win from './sounds/win.mp3';

/* Define common assets here */
const Assets = {
  images: {
    arrow: arrow,
    background: background,
    background2: background2,
    backgroundClear: backgroundClear,
    bubbleLeft: bubbleLeft,
    bubbleRight: bubbleRight,
    sorry: sorry
  },
  textures: {
    button: button
  },
  sounds: {
    bgmusic: bgmusic,
    lose: lose,
    pop: pop,
    win: win
  },
  fonts: {
  }
}

/* Define assets which are loaded depending on parameters passed to
View.js
*/
export const DynamicAssets = {
  images: {
    smileyHappy,
    smileySad
  },
  textures: {
  },
  sounds: {
  },
  fonts: {
  }
}

/* Array of common assets to be used by Hexi Loader */
export const ASSETS = [
  Assets.images.arrow,
  Assets.images.background,
  Assets.images.background2,
  Assets.images.backgroundClear,
  Assets.images.bubbleLeft,
  Assets.images.bubbleRight,
  Assets.images.sorry,
  Assets.textures.button,
  // Assets.sounds.bgmusic,
  // Assets.sounds.lose,
  // Assets.sounds.win,
  // Assets.sounds.pop
];

/* Array of dynamic assets to be used by View.js. The index specified
by dynamicAssetIndex props will be the one that will be loaded along with
the common assets. See constructor of View.js for more details */
export const DYNAMIC_ASSETS = [
  DynamicAssets.images.smileyHappy,
  DynamicAssets.images.smileySad
]

export default Assets;
