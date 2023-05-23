class GameMap {
    constructor(config) {
        this.characters = {};
        this.backgroundObjects = {};
        this.removedCharacters = {};
        
        this.configCharacters = config.configCharacters;
        this.staticCharacters = config.staticCharacters;

        this.backgroundImage = new Image();
        this.backgroundImage.src = config.backgroundSrc;
        this.gameScreen = config.gameScreen || null;

        this.characterAtThrone = null;
        this.characterWalking = false;
        this.hoveredCharacter = null;

        this.isCutscenePlaying = false;
        this.currentCharacterGroup = 0;
    }

    drawBackgroundImage(ctx) {
        ctx.drawImage(this.backgroundImage, 0, 0)
        }
    

    drawHUDelements(ctx) {
        if (this.hoveredCharacter) {
            //Create a nameTag over the character the mouse is hovering
            let nameTag = new NameTag ({
                name: this.hoveredCharacter.name,
                x: this.hoveredCharacter.x,
                y: this.hoveredCharacter.y - 10,
                ctx,
            })
            nameTag.displayName();
        }

        ctx.drawImage(this.backgroundImage, 764, 0, 260, 576, 764, 0, 260, 576)
    }

    spawnCharacters() {
        const week = window.gameState.week;

        // Check if all character nodes are null
        if (utils.allCharacterNodesAreNull()) {
            // Proceed to the endings
            window.gameState.endingManager.init(document.querySelector('.game-container'));
        }
      
        // Add static characters that are always on the map
        for (const key in this.staticCharacters) {
          const object = this.staticCharacters[key];
          object.id = key;
          const instance = new Character(object);
          this.backgroundObjects[key] = instance;
          this.backgroundObjects[key].id = key;
        }
      
        if (this.gameScreen) {
            // Filter configCharacters based on dialogueNodes and the current week
            const filteredConfigCharacters = utils.filterCharactersByWeekAndDialogueNodes(
            week,
            this.configCharacters
        );
      
        // Assign filtered characters to characterConfig
        this.configCharacters = filteredConfigCharacters;

        // Calculate the starting index for the current character group
        const startIndex = this.currentCharacterGroup * 4;

        // Calculate the number of characters to spawn based on the week and the remaining characters
        const remainingCharacters = Object.keys(filteredConfigCharacters).length - startIndex;
        const numCharactersToSpawn = Math.min(4, remainingCharacters);
    
        // Choose characters to spawn based on the week, the current character group, and the number of characters to spawn
        const randomKeys = utils.getRandomKeys(filteredConfigCharacters, numCharactersToSpawn, startIndex);
    
        // Initialize each character as a new character through the Character class
        randomKeys.forEach((key, index) => {
            const object = filteredConfigCharacters[key];
            object.id = key;
        
            // Set the x-coordinate based on the order of the characters
            object.x = (50 * index) + 15; // Change the multiplier (50) to adjust the spacing between characters
        
            const instance = new Character(object);
            this.characters[key] = instance;
            this.characters[key].id = key;
        
            this.removedCharacters[key] = filteredConfigCharacters[key];
            // Remove the spawned character from the configCharacters object
            delete this.configCharacters[key];
            });
        }
    }

    handleMouseMove(e) {
        // Get the canvas' bounding rectangle which includes its position and dimensions.
        const rect = e.target.getBoundingClientRect();
        
        // Calculate the mouse's x and y position within the canvas then subtract the canvas' left and top positions
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Initialize a variable to store the found character, if any.
        let foundCharacter = null;
        
        // Iterate through all characters in the characters array.
        for (const key in this.characters) {
            const character = this.characters[key];
        
            // Check if the mouse's position collides with position of any character
            if (mouseX >= character.x && mouseX <= character.x + character.sprite.spriteWidth &&
                mouseY >= character.y && mouseY <= character.y + character.sprite.spriteHeight) {
        
                foundCharacter = character;
                break;
            }
        }
    
        this.hoveredCharacter = foundCharacter;
    
        // Check for mouse click
        if (e.type === 'click') {
            if (this.isCutscenePlaying) {
                return
            }
    
            if (this.hoveredCharacter) {
                const charactersArray = Object.values(this.characters).reverse();
                const characterAtThrone = charactersArray.find(character => character.x === 200);
        
                if (this.hoveredCharacter === characterAtThrone) {
                    this.exitThrone();
                } else {
                    this.callToThrone();
                    this.hoveredCharacter = characterAtThrone; // Update the hoveredCharacter to the character at the throne
                }
            }
        }
    }
    


    async callToThrone() {
        const throneX = 200;
    
        // Convert characters object to an array and reverse it to give correct position of npcs
        const throneLine = Object.values(this.characters).reverse();
    
        // Find the first character not at the throne
        const characterToCall = throneLine.find(character => character.x !== throneX);
        
        // Check if there is already a character at the throne
        if (this.characterAtThrone) {
            console.log("There is already a character at the throne.");
            return;
        }

        if (characterToCall && !this.characterWalking) {
            this.characterWalking = true;
            await utils.moveCharacterToPosition(characterToCall, throneX);
            this.characterWalking = false;
            this.characterAtThrone = characterToCall; // Update the character at the throne

            //Initiate the appropiate dialogue for the character
            
            this.characterAtThrone.doDialogueNode(this);
        }
    }
    
    async exitThrone() {
        // Convert characters object to an array and reverse it to give correct position of npcs
        const charactersArray = Object.values(this.characters).reverse();
        const targetXValue = 800;
    
        // Get the first character
        const firstCharacter = charactersArray[0];
    
        // Move the first character offscreen to the right
        if (!this.characterWalking) {
            this.characterWalking = true;
            await utils.moveCharacterToPositionSpeed(firstCharacter, targetXValue, 0.1);
            this.characterWalking = false;
            this.characterAtThrone = null; // Set the character at the throne to null
            delete this.characters[firstCharacter.id];
        }
    
        // Remove the character from the characters object
        delete this.characters[firstCharacter.id];

        // Call nextWeek method to check for empty throne room and repopulate characters
        this.nextWeek();
    }

    nextWeek() {
        if (Object.keys(this.characters).length === 0) {
            //initiate the next week
            window.gameState.nextWeek();


            if (window.gameState.week === 5) {
                this.configCharacters = this.removedCharacters
                console.log("Wokring");
                console.log(this.removedCharacters);
            }

            const sceneTransition = new SceneTransition();
            sceneTransition.init(document.querySelector(".game-container"), () => {
                // Call spawnCharacters after the scene transition has completed
                this.spawnCharacters();        
                sceneTransition.fadeOut();
            })
            
        }

    }
      
    
    async startCutscene(events) {
        this.isCutscenePlaying = true;

        //Loop of async events that awaits for each event to occur
        for(let i = 0; i < events.length; i++) {
            const eventHandler = new GameEvent({
            event: events[i],
            map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;
    }
    
}

window.GameMaps = {
    GameScreen: {
        gameScreen: true,
        backgroundSrc: "images/backgrounds/gameScreen.png",
        staticCharacters: {
            ThroneQuinn: {
                name: "Quinn",
                x: 358,
                y: 276,
                src: "images/characters/Throne_Quinn.png"
            },
        },
        configCharacters: {
            //Key Characters
            Emery: {
                name: "Emery",
                x: 128,
                src: "images/characters/Emery.png",
                type: "linear",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Emery", text: "I know you have kindness in your heart..."},
                        {type: "speech", character: "Emery", text: "Please can you help support the search for Aunt Eudora"},
                        {type: "choice", choice1: "Send Troops (5G)", choice2: "Decline",
                            consequence1: ['golems', -5], consequence2: null,
                            character: "Emery", response1: "Thank you for your troubles", response2: "Fine, I shall continue my search alone",
                            nextNode1: "reveal2", nextNode2: null},
                    ],
                    reveal2: [
                        {type: "speech", character: "Emery", text: "Your Grace, thanks to your kindness, I have made a great discovery"},
                        {type: "speech", character: "Emery", text: "I believe that Aunt Eudora is still alive and took refuge in the spirit realm"},
                        {type: "speech", character: "Emery", text: "I found her amulet at an ancient ritual in the western plains"},
                        {type: "addItem", itemId: "amulet"},
                        {type: "speech", character: "Emery", text: "I believe this would be safer with you"},
                        {type: "changeNode", character: "Emery", newNode: null},
                    ]
                },
                
            },
            Maxine: {
                name: "Maxine",
                x: 80,
                src: "images/characters/Maxine.png",
                type: "linear",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Maxine", text: "I wish to study under the Witch Amadia",},
                        {type: "speech", character: "Maxine", text: "Please could I get your permission",},
                        {type: "choice", choice1: "Grant permission", choice2: "Reject",
                            consequence1: null, consequence2: null,
                            character: "Maxine", response1: "I knew you were the best!", response2: "Hmmp, see if that will stop me",
                            nextNode1: "apprentice2", nextNode2: "vengeful3"},
                    ],
                    apprentice2: [
                        {type: "speech", character: "Maxine", text: "My apprenticeship is going great"},
                        {type: "speech", character: "Maxine", text: "Now I can turn Emery's bird into a cat when she annoys me"},
                        {type: "consequence", consequence: ['wealth', +15]},
                        {type: "speech", character: "Maxine", text: "This is thanks for your recommendation!"},
                        {type: "changeNode", character: "Maxine", newNode: null},
                        {type: "addEnding", ending: "littleWitch"},
                    ],
                    vengeful3: [
                        {type: "speech", character: "Maxine", text: "Well, I went to study under the great Witch Amadia"},
                        {type: "speech", character: "Maxine", text: "Here's a taste of my latest spell, hmph"},
                        {type: "choice", choice1: "Bribe (5C)", choice2: "...",
                        consequence1: [['wealth', -5],  ['influence', +10]], consequence2: null,
                        character: "Maxine", response1: "I guess I shall forgive your transgressions", response2: "You shall regret this",
                        nextNode1: null, nextNode2: null}
                    ]
                }
            },
            Lucien: {
                name: "Lucien",
                src: "images/characters/Lucien.png",
                type: "static",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Lucien", text: "Your Grace, I sense a terrible foreboding on the horizon"},
                        {type: "speech", character: "Lucien", text: "Would you like me to investigate further"},
                        {type: "speech", character: "Lucien", text: "Or would you prefer I continue managing domestic affairs"},
                        {type: "choice", choice1: "Investigate", choice2: "Continue Managment",
                            consequence1: null, consequence2: ['influence', +14] ,
                            character: "Lucien", response1: "I promise to get results", response2: "Understood, Your Grace",
                            nextNode1: "investigate2", nextNode2: "managment3"},
                    ],
                    investigate2: [
                        {type: "speech", character: "Lucien", text: "I have made a troubling discovery"},
                        {type: "speech", character: "Lucien", text: "There is a Tier 8 magical anomaly fostering in Arcanus forest"},
                        {type: "speech", character: "Lucien", text: "Your Grace, it is of utmost importance to take preventative measures"},
                        {type: "choice", choice1: "Prepare (15G, 10S, 5C)", choice2: "Ignore",
                            consequence1: [['golems', -15],  ['supplies', -10], ['wealth', -5]], consequence2: null ,
                            character: "Lucien", response1: "I hope its not as bad as it looks...", response2: "Understood, Your Grace",
                            nextNode1: null, nextNode2: null},
                        {type: "addEnding", ending: "lucienInvestigate"},
                        
                    ],
                    managment3: [
                        {type: "speech", character: "Lucien", text:"My general census and review had brought some news",},
                        {type: "speech", character: "Lucien", text: "There is an increasingly high rate of magical incidents in the Domain",},
                        {type: "speech", character: "Lucien", text: "Do you want to invest in a specialized task force",},
                        {type: "choice", choice1: "Invest (10G, 5C)", choice2: "Refuse",
                            consequence1: [['golems', -10],  ['wealth', -5]], consequence2: null,
                            character: "Lucien", response1: "I will do my best", response2: "Understood, Your Grace",
                            nextNode1: null, nextNode2: null},
                    ]
                }
            },
            Gaius: {
                name: "Gaius",
                src: "images/characters/Gaius.png",
                type: "static",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Gaius", text: "Your Grace, lack of funding has led to the golems deteriorating"},
                        {type: "speech", character: "Gaius", text: "The upkeep of the Department of Defense is of utmost importance"},
                        {type: "speech", character: "Gaius", text: "We would need 10 Crystals to strengthen our troops"},
                        {type: "choice", choice1: "Fine (10C)", choice2: "Decline",
                            consequence1: ['wealth', -10], consequence2: null,
                            character: "Gaius", response1: "Thank you, Your Grace", response2: "Understood",
                            nextNode1: "node2", nextNode2: "node2"},
                    ],
                    node2: [
                        {type: "speech", character: "Gaius", text: "Your Grace, the arcane turbulence has risen to dangerous levels"},
                        {type: "speech", character: "Gaius", text: "I believe that our current golem models could benefit from an upgrade"},
                        {type: "choice", choice1: "Invest (14C)", choice2: "Decline",
                        consequence1: ['wealth', -14], consequence2: null,
                        character: "Gaius", response1: "Much appreciated, Your Grace", response2: "Understood",
                        nextNode1: null, nextNode2: null},
                        {type: "addEnding", ending: "military"},
                    ]
                }
            },
            Flora: {
                name: "Flora",
                src: "images/characters/Flora.png",
                type: "static",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Flora", text: "I am trying to regenerate an ancient plant strain known as Hemlock"},
                        {type: "speech", character: "Flora", text: "I believe that growing a Hemlock will bring great benefits to the Domain"},
                        {type: "speech", character: "Flora", text: "Your Grace, I only need 3 crystals to fund my research"},
                        {type: "choice", choice1: "Fine (3C)", choice2: "Decline",
                            consequence1: ['wealth', -3], consequence2: null,
                            character: "Flora", response1: "Your efforts will be remebered", response2: "I will prove you wrong!",
                            nextNode1: "research2", nextNode2: null},
                    ],
                    research2: [
                        {type: "speech", character: "Flora", text: "Your Grace, I have successfully regenerated a mutant strain of Hemlock"},
                        {type: "speech", character: "Flora", text: "Here's a vial of sap from its first flowering"},
                        {type: "addItem", itemId: "vial"},
                        {type: "speech", character: "Flora", text: "It is said to have strong medicinal properties"},
                        {type: "changeNode", character: "Flora", newNode: null},
                        {type: "addEnding", ending: "hemlock"},
                    ]
                }
            },
            //Potential Allies
            Vincent: {
                name: "Vincent",
                src: "images/characters/Vincent.png",
                type: "linear",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Vincent", text: "I am Vincent the Untouchable"},
                        {type: "speech", character: "Vincent", text: "Self-proclaimed greatest monster hunter of the land"},
                        {type: "speech", character: "Vincent", text: "Lend me some crystals for armour, and I shall lend you my strength"},
                        {type: "choice", choice1: "Lend Crystals (12C)", choice2: "Decline Assistance",
                            consequence1: ['wealth', -12], consequence2: null,
                            character: "Vincent", response1: "You have made the right choice", response2: "Then I shall take my leave",
                            nextNode1: "help2", nextNode2: null},
                    ],
                    help2: [
                        {type: "speech", character: "Vincent", text: "Hahaha, I bring great news"},
                        {type: "speech", character: "Vincent", text: "I have slain the head of the Dragonmore clan"},
                        {type: "speech", character: "Vincent", text: "Yes, the one that lurked in the outer realm"},
                        {type: "addItem", itemId: "scale"},
                        {type: "speech", character: "Vincent", text: "This is its reverse scale"},
                        {type: "changeNode", character: "Vincent", newNode: null},
                    ]
                }
            },
            Elspeth: {
                name: "Elspeth",
                src: "images/characters/Elspeth.png",
                type: "static",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Elspeth", text: "Here is my certificate from the Herbalist Guild"},
                        {type: "speech", character: "Elspeth", text: "I act on the principle of equivalent exchange"},
                        {type: "speech", character: "Elspeth", text: "I need some supplies to support my herbal garden"},
                        {type: "speech", character: "Elspeth", text: "In return, I can strengthen your golems with nature magic"},
                        {type: "choice", choice1: "Agree to trade (15S)", choice2: "Decline Trade",
                            consequence1: [['supplies', -15],  ['golems', +20]], consequence2: null,
                            character: "Elspeth", response1: "May quetzalcoatlus be with you", response2: "May quetzalcoatlus be with you",
                            nextNode1: "node2", nextNode2: "node2"},
                    ],
                    node2: [
                        {type: "speech", character: "Elspeth", text: "Your Grace, the whispers of nature have become agitated"},
                        {type: "speech", character: "Elspeth", text: "I suspect that the magical anomaly is interfering with the natural cycle"},
                        {type: "speech", character: "Elspeth", text: "I propose that the Domain do further research on nearby plant samples"},
                        {type: "choice", choice1: "Conduct Research (18C)", choice2: "Decline",
                            consequence1: [['wealth', -18],  ['influence', +5]], consequence2: null,
                            character: "Elspeth", response1: "May quetzalcoatlus be with you", response2: "May quetzalcoatlus be with you",
                            nextNode1: null, nextNode2: null},
                    ]
                }
            },
            Rowan: {
                name: "Rowan",
                src: "images/characters/Rowan.png",
                y: 356,
                spriteHeight: 112,
                type: "linear",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Rowan", text: "I heard that your Domain is recruiting mercenaries"},
                        {type: "speech", character: "Rowan", text: "I feel obliged to offer my assistance"},
                        {type: "choice", choice1: "Accept recruitment (23C)", choice2: "Decline Assistance",
                            consequence1: [['wealth', -23],  ['golems', +35]], consequence2: null,
                            character: "Rowan", response1: "I am at your service", response2: "Then I shall take my leave",
                            nextNode1: "aid2", nextNode2: null},
                    ],
                    aid2: [
                        {type: "speech", character: "Rowan", text: "Your Grace, I have noticed that civilians have grown restless"},
                        {type: "speech", character: "Rowan", text: "And certain groups are stocking up on supplies"},
                        {type: "speech", character: "Rowan", text: "Do you need me to help maintain order in the outer realm"},
                        {type: "speech", character: "Rowan", text: "Or should I continue patrolling the inner realm"},
                        {type: "choice", choice1: "Maintain Order", choice2: "Continue Patrolling",
                            consequence1: ['influence', +5], consequence2: null,
                            character: "Rowan", response1: "I am at your service", response2: "Then I shall take my leave",
                            nextNode1: null, nextNode2: null},
                    ]
                }
            },
            //Head of occult societies
            MadameDiane: {
                name: "Diane",
                src: "images/characters/Madame_Diane.png",
                type: "linear",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Diane", text: "I am Lady Diane, leader of Tenebris, I have come to negotiate"},
                        {type: "speech", character: "Diane", text: "The magic anomaly, arcane id 028376, poses a great threat to the land"},
                        {type: "speech", character: "Diane", text: "I urge you to take preventative measures to help protect our Domains"},
                        {type: "speech", character: "Diane", text: "I am already in the process of forming an artificial wave barrier"},
                        {type: "choice", choice1: "Take Measures (15S, 20C)", choice2: "Refuse Advice",
                            consequence1: [['supplies', -15], ['golems', -20]], consequence2: null,
                            character: "Diane", response1: "You are right to heed my warning", response2: "Well, I wish you good luck",
                            nextNode1: "alliance2", nextNode2: null},
                    ],
                    alliance2: [
                        {type: "alliesUpdate", society: "Tenebris", relationship: "friendly"},
                        {type: "speech", character: "Diane", text: "Although some our greedy for the power of the magic anomaly"},
                        {type: "speech", character: "Diane", text: "History shows that caution is the best course of action"},
                        {type: "speech", character: "Diane", text: "I hope our preparations our enough"},
                        {type: "changeNode", character: "Diane", newNode: null},
                        {type: "addEnding", ending: "dianeAlly"},
                    ]
                }
            },
            SirMagnus: {
                name: "Magnus",
                src: "images/characters/Sir_Magnus.png",
                type: "linear",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Magnus", text: "Sir Magnus is my title, I bring greetings from Hermeticus"},
                        {type: "speech", character: "Magnus", text: "The recent changes brought by the magic anomaly have grown dire"},
                        {type: "speech", character: "Magnus", text: "I suggest we form a collaborative force"},
                        {type: "speech", character: "Magnus", text: "The team can investigate the cause and increase surrounding security"},
                        {type: "choice", choice1: "Join Force (20G, 10S)", choice2: "Refuse",
                            consequence1: [['golems', -20], ['supplies', -10]], consequence2: null,
                            character: "Magnus", response1: "I will also prepare with great haste", response2: "Then I'm afraid I can't share my findings",
                            nextNode1: "alliance2", nextNode2: null},
                    ],
                    alliance2: [
                        {type: "alliesUpdate", society: "Hermeticus", relationship: "friendly"},
                        {type: "speech", character: "Magnus", text: "The investigative force has made some headway"},
                        {type: "speech", character: "Magnus", text: "The data collected shows that magic anomaly is still dormant"},
                        {type: "speech", character: "Magnus", text: "However, once the arcane density reaches a high enough threshold..."},
                        {type: "speech", character: "Magnus", text: "There should be an explosion followed by erratic mana waves"},
                        {type: "speech", character: "Magnus", text: "Do you believe that further exploration is still needed"},
                        {type: "choice", choice1: "Explore Further (15G, 5S)", choice2: "It's enough",
                            consequence1: [['golems', -15], ['supplies', -5]], consequence2: null,
                            character: "Magnus", response1: "I admire your prudence", response2: "Oh, I wish your Domian the best",
                            nextNode1: null, nextNode2: null},
                    ]
                }
            },
            LadyHawthorne: {
                name: "Hawthorne",
                src: "images/characters/Lady_Hawthorne.png",
                type: "linear",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Hawthorne", text: "Quinn, I expect I shall not have to queue my next visit"},
                        {type: "speech", character: "Hawthorne", text: "I presume you have heard of the recent magical anomaly"},
                        {type: "speech", character: "Hawthorne", text: "You must know that with crisis comes opportunity"},
                        {type: "speech", character: "Hawthorne", text: "I implore you to invest in my exploration team"},
                        {type: "choice", choice1: "Invest (20C)", choice2: "Refuse",
                            consequence1: ['wealth', -20], consequence2: null,
                            character: "Hawthorne", response1: "I knew you were a wise one", response2: "So thats how it shall be...",
                            nextNode1: "invest2", nextNode2: "revenge3"},
                    ],
                    invest2: [
                        {type: "alliesUpdate", society: "Pracepta", relationship: "friendly"},
                        {type: "speech", character: "Hawthorne", text: "I'm back and with good news"},
                        {type: "speech", character: "Hawthorne", text: "This magical anomaly is actually a germinating secret realm"},
                        {type: "speech", character: "Hawthorne", text: "You are fortunate that I, once again, invite you to support my team"},
                        {type: "choice", choice1: "Support (25C)", choice2: "Refuse",
                            consequence1: ['wealth', -25], consequence2: null,
                            character: "Hawthorne", response1: "You were always my favourite", response2: "Well, you must not be affluent enough...",
                            nextNode1: null, nextNode2: null},
                    ],
                    revenge3: [
                        {type: "alliesUpdate", society: "Pracepta", relationship: "hostile"},
                        {type: "speech", character: "Hawthorne", text: "I have discovered a secret realm"},
                        {type: "speech", character: "Hawthorne", text: "Not that this discovery had anything to do with you"},
                        {type: "speech", character: "Hawthorne", text: "Sigh, I have graciously forgiven your previous transgression"},
                        {type: "speech", character: "Hawthorne", text: "You are now allowed to invest in some shares of my investigative team"},
                        {type: "choice", choice1: "Invest (15C, 10G)", choice2: "Refuse",
                            consequence1: [['wealth', -15], ['golems', -10]], consequence2: null,
                            character: "Hawthorne", response1: "Oh, so now we're in the mood", response2: "Tch, I'll get you next time",
                            nextNode1: null, nextNode2: null},
                        {type: "addEnding", ending: "betrayal"},
                    ]
                }
            },
            //General NPCs
            Alchemist: {
                name: "Alchemist",
                src: "images/characters/Alchemist.png",
                type: "static",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Alchemist", text: "Your Grace, I have applied for a new alchemical patent"},
                        {type: "speech", character: "Alchemist", text: "My skills are evident, but alas, I lack the funds to start mass production"},
                        {type: "choice", choice1: "Invest (5C)", choice2: "Send Away",
                            consequence1: [['wealth', -5], ['influence', +10]], consequence2: null,
                            character: "Alchemist", response1: "This will surely prove to be a worthy investement", response2: "Alas, maybe next time",
                            nextNode1: "node2", nextNode2: "node2"},
                    ],
                    node2: [
                        {type: "speech", character: "Alchemist", text: "Your Grace, my apprentice has found traces of a Tier 4 spirit plant"},
                        {type: "speech", character: "Alchemist", text: "Unfortunately, it is in the depths of the Forest of Nyx"},
                        {type: "speech", character: "Alchemist", text: "Can you help provide manpower so we can secure the spirit plant"},
                        {type: "choice", choice1: "Send Troops (5G)", choice2: "Send Away",
                            consequence1: [['golems', -5], ['influence', +4], ['wealth', +10]], consequence2: null,
                            character: "Alchemist", response1: "Here's a deposit for your troubles", response2: "That's too bad",
                            nextNode1: null, nextNode2: null},
                    ]
                }
            },
            Blacksmith: {
                name: "Blacksmith",
                src: "images/characters/Blacksmith.png",
                type: "static",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Blacksmith", text: "Your Grace, the elemental spirits have become erratic"},
                        {type: "speech", character: "Blacksmith", text: "Several smiths have experienced explosive damage"},
                        {type: "speech", character: "Blacksmith", text: "I implore you to open a support fund"},
                        {type: "speech", character: "Blacksmith", text: "We will repay you from our current stock"},
                        {type: "choice", choice1: "Open Support Fund (10C)", choice2: "Refuse",
                            consequence1: [['wealth', -10], ['golems', +15]], consequence2: null,
                            character: "Blacksmith", response1: "We thank you for your kindness", response2: "Understood",
                            nextNode1: "node2", nextNode2: "node2"},
                    ],
                    node2: [
                        {type: "speech", character: "Blacksmith", text: "Your Grace, I have made a breakthrough in my smithing technique"},
                        {type: "speech", character: "Blacksmith", text: "May I have some enchanted mythril to strengthen our golems"},
                        {type: "choice", choice1: "Give Mythril (14S)", choice2: "Send Away",
                            consequence1: [['supplies', -14], ['golems', +16]], consequence2: null, 
                            character: "Blacksmith", response1: "I'll get started right away, You Grace", response2: "Good day",
                            nextNode1: null, nextNode2: null},
                    ]
                }
            },
            Healer: {
                name: "Healer",
                src: "images/characters/Healer.png",
                type: "static",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Healer", text: "Your Grace, a disease has been festering in the outer realm"},
                        {type: "speech", character: "Healer", text: "It does not seem to be fatal, but I still wish to contain the spread"},
                        {type: "speech", character: "Healer", text: "Please, could you lend your support"},
                        {type: "choice", choice1: "Lend Help (2G, 5S)", choice2: "Send Away",
                            consequence1: [['wealth', -5], ['influence', +10]], consequence2: null,
                            character: "Healer", response1: "Thank you, Your Grace", response2: "But the civilians...",
                            nextNode1: "node2", nextNode2: "node2"},
                    ],
                    node2: [
                        {type: "speech", character: "Healer", text: "Your Grace, the disease has mutated and spread to the inner realm"},
                        {type: "speech", character: "Healer", text: "There is an urgent need for more manpower and supplies"},
                        {type: "choice", choice1: "Help (9G, 12S)", choice2: "Send Away",
                            consequence1: [['golems', -9], ['supplies', -12], ['influence', +15]], consequence2: null,
                            character: "Healer", response1: "This is most appreciated, Your Grace", response2: "Well..I shall take my leave..",
                            nextNode1: null, nextNode2: null},
                    ]
                }
            },
            Merchant: {
                name: "Merchant",
                src: "images/characters/Merchant.png",
                type: "static",
                dialogue: {
                    node1: [
                        {type: "speech", character: "Merchant", text: "Your Grace, I have a business proposition for your Domain"},
                        {type: "speech", character: "Merchant", text: "A new crystal mine shaft has been found in the east"},
                        {type: "speech", character: "Merchant", text: "I can trade you crystalline shards for the protection of my caravan"},
                        {type: "choice", choice1: "Trade (4G)", choice2: "Send Away",
                            consequence1: [['golems', -4], ['wealth', +12]], consequence2: null,
                            character: "Merchant", response1: "Oh, a happy transaction", response2: "Maybe we can trade next time",
                            nextNode1: "node2", nextNode2: "node2"},
                    ],
                    node2: [
                        {type: "speech", character: "Merchant", text: "Your Grace, a merchant from Tenebris sabotaging our crystal industry"},
                        {type: "speech", character: "Merchant", text: "May you provide diplomatic support so we can secure the mining rights"},
                        {type: "choice", choice1: "Provide support (15I)", choice2: "Decline offer",
                            consequence1: [['influence', -15], ['wealth', +20]], consequence2: null,
                            character: "Merchant", response1: "Oh, a happy transaction", response2: "Okay...",
                            nextNode1: null, nextNode2: null},
                    ]
                }
            },
        }
    },
    MysticCouncil: {
        backgroundSrc: "images/backgrounds/mysticCouncil.png",
        configCharacters: {
            Quinn: {
                name: "Quinn",
                src: "images/characters/Quinn.png"
            },
        }
    },
    Bedroom: {
        backgroundSrc: "images/backgrounds/sleepChamber.png",
    },
    Garden: {
        backgroundSrc: "images/backgrounds/herbalGarden.png",
    }
}