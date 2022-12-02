import { _decorator, Component, Game,  } from 'cc';
import { KViewName, ViewName } from '../libs/constants';
import { GameView } from './GameView';
import { HomeView } from './HomeView';
import { LevelView } from './LevelView';
import { IView } from './View';
const { ccclass, property } = _decorator;

@ccclass('ViewMgr')
export class ViewMgr extends Component {

    public static ins:ViewMgr


    views: Record<string, IView> = {}

    homeView: HomeView
    levelView: LevelView
    gameView: GameView


    onLoad() {
        console.log("onLoad", this.name) 
    }

    start() {
        console.log("start", this.name)
        ViewMgr.ins = this
        this.initViews()
    }



    showView(name: KViewName) {
        for( let key in this.views) {
            if(key ==  name) {
                this.views[key].show()
            }else {
                this.views[key].close()
            }
        }
    }

    setView(name: string, view: IView){
        this.views[name] = view
    }

    initViews() {
        this.homeView = this.getComponentInChildren(HomeView)
        this.views[ViewName.HomeView] = this.homeView

        this.levelView = this.getComponentInChildren(LevelView)
        this.views[ViewName.LevelView] = this.levelView

        this.gameView = this.getComponentInChildren(GameView)
        this.views[ViewName.GameView] = this.gameView
    }
}

