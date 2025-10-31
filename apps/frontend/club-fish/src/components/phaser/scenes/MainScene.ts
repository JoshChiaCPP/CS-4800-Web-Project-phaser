import Phaser from "phaser";
import { Client, Room } from "colyseus.js"
import { Player, MyRoomState } from "../../../../server/src/rooms/schema/MyRoomState";
import { room, playerEntities } from "./BootScene"
import { Schema, MapSchema, type} from "@colyseus/schema";

export class MainScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  fish!: Phaser.GameObjects.Image;
  client = new Client("ws://localhost:2567");
  joined = false;
  myId = "";
  //local input cache
  inputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  constructor() {
    super("main");
  }

  preload() {

  }

  create() {
    this.cursors = this.input.keyboard?.createCursorKeys()
    //console.log("testing")
    const { width, height } = this.scale;
    var canvasX = 0;
    var canvasY = 0;

    // You guys can paint assets loaded from bootScene here
    this.add.image(width * 0.5, height * 0.5, "bg").setOrigin(0.5);
    this.fish = this.add.image(width * 0.3, height * 0.55, "clownfish").setScale(3);

    // Simple phaser tween example you can try any of the other phaser examples here or delete and add movement controls
    // this.tweens.add({
    //   targets: this.fish,
    //   x: width * 0.7,
    //   yoyo: true,
    //   repeat: -1,
    //   duration: 2400,
    //   ease: "Sine.easeInOut"
    // });

    //get mouse click coordinates
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      canvasX = pointer.x;
      canvasY = pointer.y;
      console.log(`Mouse clicked at Canvas X: ${canvasX}, Canvas Y: ${canvasY}`);
      //send coords to server
      room.send("movement", {x: canvasX, y: canvasY})

      //move player fish
      this.tweens.add({
        targets: this.fish,
        x: canvasX,
        y: canvasY,
        duration: 3000,
        ease: 'Power1',
      });
    })
    //send server message that "I" joined to recieve my id in return
    room.send("i-joined", "");
    room.onMessage("your-id", (id) => {
      this.myId = id;
    })



    //receive broadcast messages from server, looking for new players,
    room.onMessage("someone-joined", (sessionId) => {
      console.log("message recieved from the server");
      console.log(sessionId);
      //keep reference of new player
      const entity = this.add.image(width * 0.3, height * 0.55, "clownfish").setScale(3).setTint(0x00ff00);
      playerEntities[sessionId] = entity;
      
    });
    

    //try using broadcast messages from server to listen for position changes
    // message.id => sessionId
    room.onMessage("someone-moved", (message) => {
      //check if player exists yet
      if (playerEntities[message.id] == null && (message.id != this.myId)){
        const entity = this.add.image(width * 0.3, height * 0.55, "clownfish").setScale(3).setTint(0x00ff00);
        playerEntities[message.id] = entity;
      }
      console.log("sprite to move:", message.id, message.x, message.y);
      this.tweens.add({
        targets: playerEntities[message.id],
        x: message.x,
        y: message.y,
        duration: 3000,
        ease: 'Power1',
      });
    });

    room.onMessage("someone-left", (id) => {
      playerEntities[id].destroy();
      playerEntities[id] = null;
    })
  }

  public disconnectUser() {
    
  }

  update() {
    if (!this.cursors){
			return
		}
    if (this.cursors.shift?.isDown){
      this.scene.start('rps');
		}
    this.events.on('shutdown', () => { //not working yet
            console.log("leaving main scene and room");
            room.send("i-left", "")

            room.leave();

        })
  }

  onDestroy(){ // not working yet
    console.log("left mainscene");
  }
}
