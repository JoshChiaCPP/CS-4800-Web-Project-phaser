import Phaser from "phaser";
import { Client, Room } from "colyseus.js"
import { Player, MyRoomState } from "../../../../server/src/rooms/schema/MyRoomState";
export let room!: Room;
export let playerEntities: {[sessionId: string]: any} = {};
export class BootScene extends Phaser.Scene {
  //colyseus connection
  client = new Client("ws://localhost:2567");
  //playerEntities: {[sessionId: string]: any} = {};



  constructor() {
    super("boot");
  }
  preload() {
    // You guys can load any assetts here and define names from public folder!
    // /public/assets
    this.load.image("bg", "/assets/background.png");
    this.load.image("clownfish", "/assets/Clownfish.png");

    //minigameRPS assets
    this.load.image('rps-bg', 'assets/rps-bg2.png') //replace asset later
    this.load.spritesheet('kelp', 'assets/kelp.png', { frameWidth: 1000, frameHeight: 1000})
    this.load.spritesheet('claw', 'assets/claw.png', { frameWidth: 1000, frameHeight: 1000})
    this.load.spritesheet('coral', 'assets/coral.png', { frameWidth: 1000, frameHeight: 1000})

    //colyseus testing assets
    

  }
  async create() {
    //colyseus room connection
    // console.log("Joining room...");

    try {
      room = await this.client.joinOrCreate("my_room")
      console.log("Joined successfully!");
      //room.state.players
      
      // room.state.players.onAdd((player: Player, sessionId: string) => {
      // if (room.sessionId === sessionId) {
      //   console.log("my session id: ", sessionId);
      // } else {
      //   console.log("Someone else joined, id: ", sessionId, "player data: ", player);
      //   //add model for them
      //   //this.fish2 = this.add.image(width * 0.3, height * 0.55, "clownfish").setScale(3).setTint(0x00ff00);
      //   }
      // })
      // this.client.joinOrCreate("my_room").then((player: Player, sessionId: string) => {
      //   console.log("Joined successfully!");
      //   room.state.players.onAdd = (player, )
      // });
      
    } catch (e) {
      console.error(e);
    } 
    
    

    //initial boot scene for now
    //this.scene.start("main");
    this.scene.start("rps"); //add a button or something later to get to minigame instead of skipping main scene
  }

  

  
}
