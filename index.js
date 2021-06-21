/* Well! I got my game starting to run but definitely not complete. There are
two issues I would like feedback/direction on for resubmission.

1) When I try to use the 'move' method, it skips the 'if' part of my if/else and jumps straight to else.
I put in a console log that reveals that currentVictim isn't being updated. It also prints an 'undefined' value.
I thought this might have to do with using strings vs objects but wasn't able to suss it out.

2)When I 'take' the backpack, it updates the Player.inventory array to include the backpack. But when I try
to use the 'use' method on the backpack, the backpack is no longer in the Player.inventory array. My
guess is that it has something to do with the scope of the various functions or maybe the inventory itself.

Thanks so much for your time and input!! Now, enter the WILDERNESS FIRST AID FINAL SCENARIO:

*/

const readline = require('readline');
const { start } = require('repl');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

//define player object literal

let Player = {
  name: "",
  mood: "",
  inventory: ["first aid kit", "nalgene", "peanut butter M&Ms (melted)"]
}

//creating class template for state objects (Victim)

class Victim {
  constructor(name, description, assessIt, interactIt, savedIt, saveNext) {
    this.name = name
    this.description = description
    this.assessIt = assessIt || "There's nothing to assess..."
    this.interactIt = interactIt || "There's nothing to interact with..."
    this.savedIt = savedIt
    this.saveNext = saveNext;
  }

  //assess the victim method that changes the savedIt flag to true
  assess() {
    if (this.assessIt) {
      console.log(this.assessIt)
      this.savedIt = true
    }
  }

  //interact with the victim method
  interact() {
    if (this.interactIt) {
      console.log(this.interactIt)
      }
    }
  

  
  //state machine method
  move(nextVictim) {
    if (this.saveNext.includes(nextVictim)) {
      currentVictim = nextVictim
      console.log(`You are now at the ${nextVictim}.`)
    } else {
      console.log(currentVictim)
      console.log(`The instructor will fail you if you do that.`)
    }
  }
}


//defining objects of the Victim class

let Starting = new Victim(
  "starting area",
  "Your prep area before the scenario begins.",
  undefined,
  undefined,
  true,
  "waterfall"
  )

let Waterfall = new Victim(
  "waterfall",
  "A multi-tiered waterfall that roars and crashes dramatically through sharp cliffs and over smooth granite faces. You can feel a faint mist spray your face as you approach.",
  undefined,
  undefined,
  true,
  "drowning victim"
)

let Drowner = new Victim(
  "drowning victim",
  "A man scrabbling his hands against slick granite to not get pulled into the current.",
  "Your first responsibility is to your own safety. Unfortunately, there is no way to save him without risking your own life. You will have to move on to the next victim.",
  "You try to get close enough to grasp the man's hand. Unfortunately, just like him, you slip on the slick granite and you both tumble into the current. Your instructor fails you for failing to assess the situation first and ends the scenario.",
  false,
  "allergic victim"
)

let Screamer = new Victim(
  "screaming victim",
  "A man pacing erratically along the riverbank while moaning and screaming.",
  "You take a moment to observe him before approaching. There appears to be nothing physically wrong with him, but he's obviously emotionally distressed. By pausing, you realize the source of his upset: a woman is lying face up in the grass, seemingly [unresponsive] to anything going on around her.",
  "You approach the man and try to reason with him. No matter how hard you try, you can't find out what's wrong. Eventually, you realize that your other victims have gone unresponsive in the time you spent with him. Your instructor fails you for failing to assess the situation and ends the scenario.",
  false,
  "unresponsive victim"
)

let Buzzer = new Victim(
  "allergic victim",
  "A woman obviously suffering an allergic attack. She is grasping at her throat with one hand and gasping as if she can't breathe.",
  "By taking a moment to observe her, you realize she is gesturing to her pocket. The shape protruding from her cargo pants tells you that it is an [epipen].",
  "You ask her repeatedly what is going on, but her gasps turn to silence and she crumbles to the ground, now motionless and unresponsive. Your instructor fails you for failing to assess the situation first and ends the scenario.",
  false,
  "screaming victim"
)

let Unresponder = new Victim(
  "unresponsive victim",
  "A woman lying motionless in the grass, her eyes half open and her limbs loose.",
  "You take a moment to recall what to do in this situation. You: rub your knuckles against her sternum (no response), check her carotid pulse (absent), and place your ear close to her mouth (no breath). It's obvious what you must do: you begin CPR.",
  "You shake her by her shoulders and scream in her face. She lolls and flops no matter how hard you try to get her to stir. Eventually, your instructor informs you that she has died and fails you for failing to assess the situation first. The scenario ends.",
  false,
  ""
)

//starting state
let currentVictim = Starting
//victim state look up table
let VictimLookUp = {
  "starting area": Starting,
  "waterfall": Waterfall,
  "drowning victim": Drowner,
  "screaming victim": Screamer,
  "allergic victim": Buzzer,
  "unresponsive victim": Unresponder
}


//creating class template for Item objects
class Item {
  constructor(name, examineIt, takeIt, useIt, location) {
    this.name = name
    this.examineIt = examineIt
    this.takeIt = takeIt || false;
    this.useIt = useIt || 'Nothing happens...'
    this.location = location
  }

  //examine the item method
  examine() {
    if (this.examineIt) {
      return this.examineIt
    }
  }

  //take the item method with state === location guard
  take() {
    if (this.takeIt && currentVictim === this.location) {
      Player.inventory.unshift(this.name)
      console.log(Player.inventory)
      return `You picked up the ${this.name}.`
    } else {
      return "You can't take that."
    }
  }
  
  //use the item method
  use() {
    if (this.location === Buzzer && Player.inventory.includes('epipen')) {
      Buzzer.savedIt = true
      return "You remove the auto-injecter from its carrying tube. You remember 'blue to the sky, orange to the thigh' and place the tip at a perpendicular angle on her upper thigh. You press firmly, hear the injector click, and count slowly to three. /n 3... /n 2... /n 1... /n You help her sit down as the epinephrine begins to take effect. Congratulations, this victim is saved! "
    } else if (this.useIt === 'scenario card') {
      Player.mood = "prepared"
      return this.useIt
    } else {
      return this.useIt
    }
  }
}

//defining objects of the Item class
let Scenario = new Item(
  'scenario card',
  'A laminated card that describes the scenario for your final test.',
  '',
  'The card reads: you are out hiking when you hear commotion at a popular waterfall. The scene contains three obvious [victim]s: one is [screaming] incoherently at the riverbank, the next is grabbing onto rocks to avoid [drowning] in the current, and the last is clutching her throat and gasping for air. Save all victims you come across to pass the scenario.\nRemember: before you take any action, it is critical to pause and assess the situation!',
  Starting
)
let Epipen = new Item(
  'epipen',
  'It is a clear plastic injector with an orange shell over the tip. It boldly proclaims EPI-PEN 3 MG EPINEPHRINE AUTO-INJECTOR and is otherwise covered in small print.',
  true,
  '',
  Buzzer
)

let Backpack = new Item(
  'backpack',
  'It is an old external frame Osprey you picked up from the gear exchange. It has served you well.',
  true,
  `You have your: ${Player.inventory}.`,
  Starting
)

//item look up table

let ItemLookUp = {
  "scenario card": Scenario,
  "epipen": Epipen ,
  "backpack" : Backpack
}

 //setting up player name and status; decided not to guard against number inputs as name and mood as it has no bearing on the game
async function playStart() {
  console.log("Congratulations! You are in the final scenario for your Wilderness First Aid certification.\nYou can [examine] , [take] or [use] items. You can [assess] and [interact] with victims. You can use [move] to access different areas and victims.")
  let playerName = "First, enter your name.\n>_"
  playerName = await ask(playerName)
  Player.name = playerName
  console.log(`Your name is ${Player.name}`)
  let playerMood = "Now: how are you feeling?\n>_"
  playerMood = await ask(playerMood)
  Player.mood = playerMood
  console.log(`You are in a ${Player.mood} mood.`)
  console.log("You are at the prep area for the final scenario. Your backpack leans nearby at your feet. There is a scenario card on a nearby picnic table describing what you must do. The trail to the waterfall winds ahead.")
  gamePlay()
}

//actual gameplay loop with if/else statements for various actions
async function gamePlay() {
  let choice = await ask("What shall you do?\n>_")
  let inputArray = choice.toLowerCase().split(" ")

    let action = inputArray[0]

    let target = inputArray.slice(1).join(" ")

  //if loop for Item objects, beginning with examine method
  if (action === 'examine') {
    if (ItemLookUp[target] instanceof Item) {
      console.log(ItemLookUp[target].examine())
    } else {
      console.log("That isn't an item.")
    }

  //else if statement regarding take method on Item objects
  } else if (action === 'take') {
    if (ItemLookUp[target] instanceof Item) {
      console.log(ItemLookUp[target].take())
    } else {
      console.log("That isn't an item.")
    }
  //else if statement regarding use method on Item objects
  } else if (action === 'use') {
    if (ItemLookUp[target] instanceof Item) {
      console.log(ItemLookUp[target].use())
    } else {
      console.log("That isn't an item.")
    }
  }

  //if loop regarding Victim objects
  if (action === 'move') {
    if (VictimLookUp[target] instanceof Victim) {
      console.log(VictimLookUp[target].move([target]))
    } else {
      console.log("That isn't somewhere you can go.")
    }

  }
  return gamePlay()
}

playStart()

