import { HexiGroup } from '../components';
import Assets, { DynamicAssets, DYNAMIC_ASSETS } from '../assets';

import TweenMax from '../libs/gsap/TweenMax.min';
import PixiPlugin from '../libs/gsap/plugins/PixiPlugin.min';
import { Sine } from '../libs/gsap/easing/EasePack.min';

const PAGE_SHIFT_TIME = 2.0;// in seconds
const GAME_TIMEOUT = 20;// 20 seconds
const TIMER_DELAY = 1000;// update each second

const SMILEY_HAPPY = "happy";
const SMILEY_SAD = "sad";

export default class SmileysMoving {
    constructor(hexi, props) {
        this.hexi = hexi;
        this.props = props;
        this.width = this.props.width;
        this.height = this.props.height;

        this.scene = new PIXI.Container();

        this.countText = new PIXI.Text('---', {
            fontWeight: 'bold',
            fontSize: 40,
            fontFamily: 'Futura',
            fill: '#000000',
            align: 'center',
            stroke: '#FFFFFF',
            strokeThickness: 6
        });
        this._updateTimerText(GAME_TIMEOUT);
        this.countText.x = (this.width - this.countText.width) / 2;
        this.countText.y = 4;
        this.scene.addChild(this.countText);

        this.itemsContainer = null;
        this.isGameOn = false;
        this.timerId = -1;
    }

    generateSmilies() {
        this._generateSmilies();
    }

    disposeSmilies() {
        this._disposeSmilies();
    }

    start() {
        this._start();
        this._startTimer();
    }

    stop() {
        this._stop();
        this._stopTimer();
    }

    _generateSmilies() {
        // fix to make whole thing more narrow on desktop browsers
        const MAX_WIDTH = this.width > this.height ? this.width * .3 : this.width;

        this.ITEM_WIDTH = Math.floor(MAX_WIDTH / this.props.itemsPerRow);
        this.ITEM_HEIGHT = this.height / Math.floor(this.height / this.ITEM_WIDTH);
        // make page to have 2 more rows to make items cycling non visible
        const itemsPerPage = this.props.itemsPerRow * Math.ceil(this.height / this.ITEM_HEIGHT);

        this.ITEMS_TOTAL = itemsPerPage * 3;// generate 3 pages
        const randomItemNum = 2;
        this.HAPPY_ITEMS_INDEXES = this._generateRandomInts(0, this.ITEMS_TOTAL, randomItemNum);
        // this.HAPPY_ITEMS_INDEXES = [
        //     0, 1, 2, 3, 4,
        //     40, 41, 42, 43, 44,
        //     80, 81, 82, 83, 84
        // ];

        // cleanup first
        this._disposeSmilies();

        // generate
        this.itemsContainer = this._createItems(DynamicAssets.images.smileyHappy, DynamicAssets.images.smileySad);
        this.itemsContainer.x = (this.width - this.itemsContainer.width) / 2;
        this.scene.addChildAt(this.itemsContainer, this.scene.children.length ? this.scene.children.length - 1 : 0);
    }

    _disposeSmilies() {
        if (this.itemsContainer) {
            this.scene.removeChild(this.itemsContainer);
            this.itemsContainer = null;
            this.itemsPool = [];
        }
    }

    _createItems(SpriteHappy, SpriteSad) {
        const itemsContainer = new PIXI.Container();
        this.itemsPool = [];

        let isHappy = false;
        for (let i = 0; i < this.ITEMS_TOTAL; i++) {
            let wrap = new PIXI.Graphics();

            isHappy = this.HAPPY_ITEMS_INDEXES.indexOf(i) >= 0 && i > this.props.itemsPerRow;
            let image = PIXI.Sprite.fromImage(isHappy ? SpriteHappy : SpriteSad);
            image.scale.set(this.ITEM_WIDTH / image.width * .7);
            image.x = (this.ITEM_WIDTH - image.width) / 2;
            image.y = (this.ITEM_HEIGHT - image.height) / 2;

            wrap.beginFill(0xFFFF00, 0);
            wrap.lineStyle(0, 0xcccccc);
            wrap.drawRect(0, 0, this.ITEM_WIDTH, this.ITEM_HEIGHT);
            // wrap.lineStyle(2, 0xcccccc);
            // if (i % this.props.itemsPerRow !== this.props.itemsPerRow - 1) {
            //     wrap.moveTo(this.ITEM_WIDTH, 0);
            //     wrap.lineTo(this.ITEM_WIDTH, this.ITEM_HEIGHT);
            // }
            // wrap.moveTo(0, this.ITEM_HEIGHT);
            // wrap.lineTo(this.ITEM_WIDTH, this.ITEM_HEIGHT);
            // wrap.endFill();

            wrap.addChild(image);

            wrap.type = isHappy ? SMILEY_HAPPY : SMILEY_SAD;
            wrap.index = i;
            // wrap.width = image.height = this.ITEM_WIDTH;
            wrap.x = i % this.props.itemsPerRow * this.ITEM_WIDTH;
            wrap.y = Math.floor(i / this.props.itemsPerRow) * this.ITEM_HEIGHT;

            // Opt-in to interactivity
            wrap.interactive = true;
            wrap.on('pointerup', this._onSmileyPress.bind(this));

            this.itemsPool.push(wrap);
            itemsContainer.addChild(wrap);

            // add number for debug
/*             let title = this.hexi.text(i);
            title.style = { fontFamily: "Futura", fontSize: "40px", align: 'center' };
            title.setPosition(10, 10);
            image.addChild(title);
 */        }

        return itemsContainer;
    }

    _onSmileyPress(e) {
        const item = e.target;
        if (!this.isGameOn) return;
        console.log('PRESSED: ' + item.type + " @ " + item.index);

        this._stop();
        this._endGame(item.type === SMILEY_HAPPY, false);
    }

    _generateRandomInts(intStart, intEnd, genTotal) {
        const numbers = [];
        for (let i = intStart; i < intEnd; i++) {
            numbers.push(i);
        }

        const randomNumbers = [];
        while (randomNumbers.length < genTotal) {
            randomNumbers.push(...numbers.splice(Math.floor(Math.random() * numbers.length), 1));
        }

        return randomNumbers;
    }

    _shiftAllUp() {
      if (this.itemsContainer) {
        let newPos = this.itemsContainer.y - this.height;
        // this.itemsContainer.y = newPos;
        TweenMax.to(this.itemsContainer, PAGE_SHIFT_TIME * .95, {
            pixi: {
                y: newPos
            },
            ease: Power4.easeOut,
            onComplete: this._cleanup.bind(this)
        });
      }
    }

    _cleanup() {
      if (this.itemsContainer) {
        let newPos = this.itemsContainer.y;
        // console.log('1-', this.itemsContainer.y);
        // 1 - shift container downs and items up (to keep coords normalized)
        let maxPos = this.ITEM_HEIGHT * 2;
        if (newPos < -maxPos) {
            newPos += maxPos;
            this.itemsPool.forEach(item => item.y -= maxPos);
        }
        this.itemsContainer.y = newPos;
        // console.log('2-', this.itemsContainer.y);

        // 2 - move all outstanding (topmost) items down
        let lastY = this.itemsPool[this.itemsPool.length - 1].y;
        const poolCopy = this.itemsPool.concat();

        poolCopy.forEach((function (item, index) {
            const itemPos = this.itemsContainer.y + item.y;
            if (index % this.props.itemsPerRow === 0) lastY += this.ITEM_HEIGHT;
            if (itemPos < -this.ITEM_HEIGHT) {
                this.itemsPool.push(this.itemsPool.splice(index, 1));
                item.y = lastY;
            }
        }).bind(this));

        this.itemsPool = poolCopy;
      }
    }

    _endGame(didWin, isTimeout) {
        if (this.props.onSmileyPress) this.props.onSmileyPress(didWin, isTimeout);
    }

    _start() {
        if(this.isGameOn) return;
        this.isGameOn = true;
        this._shiftAllUp();
        this.intId = setInterval(this._shiftAllUp.bind(this), PAGE_SHIFT_TIME * 1000);
    }

    _stop() {
        if(!this.isGameOn) return;
        this.isGameOn = false;
        if (this.intId) {
            clearInterval(this.intId);
            this.intId = -1;
        }
        TweenMax.killTweensOf(this.itemsContainer);
    }

    _startTimer() {
        if (this.timerId >= 0) this._stopTimer();

        this._updateTimerText(GAME_TIMEOUT);
        this.countDown = GAME_TIMEOUT;
        this.timerId = setInterval(this._timerUpdate.bind(this), TIMER_DELAY);
    }

    _stopTimer() {
        if (this.timerId >= 0) {
            clearInterval(this.timerId);
            this.timerId = -1;
        }
    }

    _timerUpdate() {
        this.countDown--;

        if (this.countDown > 0) {
            this._updateTimerText(this.countDown);
        } else {
            this._endGame(false, true);// no win
        }
    }

    _updateTimerText(time) {
        this.countText.text = 'Time left: ' + time;
    }
}
