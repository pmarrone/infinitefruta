﻿var g_SoundManager = null;

function Game() {
	var backBufferCanvas = null;
	var backBuffer = null;
	var context = null;
	var lastFrame = null;
	var self = this;
	var objectToBeAdded = new Array();
	var objectToDeleted = new Array();
	
	this.sortObjects = function() {
		gameObjects.sort(function(a,b){return a.zOrder - b.zOrder;});
    }
	this.resources = null;
	this.startGame = function() {
		// calculate the time since the last frame
		canvas = document.getElementById('canvas');
	
		backBufferCanvas = document.createElement('canvas');
		backBufferCanvas.width = canvas.width;
		backBufferCanvas.height = canvas.height;
		backBuffer = backBufferCanvas.getContext('2d');

		context = canvas.getContext('2d');
		gameObjects = new Array();
		loadResources();
	};
	
	function loadResources() {
		var loader = new PxLoader(); 
		var tempCtx = document.getElementById("canvas").getContext("2d");
	
		loader.addCompletionListener(function () {
			//tempCtx = null;
			
			init();
			setInterval(runGame, 1000 / 30);
		});
		
		loader.addProgressListener(function (e) {
			tempCtx.fillStyle = 'rgb(0,0,0)';
			tempCtx.fillRect(0, 0, 640, 480);
			
			tempCtx.fillStyle = '#FFFFFF';
			tempCtx.font = 'bold 30px arial';
			tempCtx.fillText(e.completedCount + ' / ' + e.totalCount, 300, 220);
		}); 
	
		self.resources = {
			splash: loader.addImage('resources/portada-final.png'),
			car: loader.addImage('resources/cars.png'),
			tileSheet: loader.addImage('resources/ruta85.png'),
			fondomenu: loader.addImage('resources/foondomenu.png'),
			background: loader.addImage('resources/fondogame.png'),
			common: loader.addImage('resources/luces.png'),
			pointer: loader.addImage('resources/pointer.png')
		};

		/*Modo de uso en los lugares de los sonidos: g_SoundManager["credits"].play();*/
		/*new SManager().startupSoundManager(/*
            [{ name: 'credits', src: 'Sound/credits.mp3' },
             { name: 'start', src: 'Sound/star.mp3' },
             { name: 'bubuzela', src: 'Sound/cheer3.wav' },
             { name: 'mezcla', src: 'Sound/mezcla.mp3' },
             { name: 'sizzle1', src: 'Sound/sizzle1.mp3' },
             { name: 'sizzle2', src: 'Sound/sizzle2.mp3' },
             { name: 'sizzle3', src: 'Sound/sizzle3.mp3' },
             { name: 'mainTheme', src: 'Sound/mainTheme.mp3' },
             { name: 'alarm', src: 'Sound/alarm.wav' }            
            ]);*/
		
		loader.start();
	}
	
	function SManager() {
		this.listSound = null;

		this.startupSoundManager = function (sounds) {
			g_SoundManager = this;

			this.listSound = new Array();

			for (var i = 0; i < sounds.length; i++) {
				var thisAudio = new Audio;
				this[sounds[i].name] = thisAudio;
				this.listSound.push(sounds[i].name);

				thisAudio.src = sounds[i].src;
			}

			return this;
		}
	}
	
	function init() {
		add(new Background());
		add(new Command());
		add(new TileGrid());
		add(new MousePointer());
	}
	
	function add(obj) {
		objectToBeAdded.push(obj);
	}
	
	function remove(obj) {
		objectToDeleted.push(obj);
	}
	
	function processAll() {
		//Added
		if (objectToBeAdded.length != 0) {
			for (var x = 0; x < objectToBeAdded.length; ++x) {
				gameObjects.push(objectToBeAdded[x]);
				objectToBeAdded[x].init();
			}
			objectToBeAdded.splice(0, objectToBeAdded.length);//.clear();
		}
		
		//Remove
		if (objectToDeleted.length != 0)
		{
			for (var x = 0; x < objectToDeleted.length; ++x) {
				gameObjects.removeObject(objectToDeleted[x]);
			}
			objectToDeleted.splice(0, objectToDeleted.length);//.clear();
		}
		self.sortObjects();
	}
	
	function runGame() {
		var thisFrame = new Date().getTime();
		var delta = (thisFrame - this.lastFrame) / 1000;
		this.lastFrame = thisFrame;
		//background colour
		backBuffer.fillStyle = "rgb(255,255,255)";
		backBuffer.fillRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < gameObjects.length; i++) {
			//try {
				//Update game object
				gameObjects[i].update(delta);
				//if object is drawable, draw
				if (gameObjects[i].draw && gameObjects[i].visible) {
					gameObjects[i].draw(backBuffer);
				}
			//} catch (e) {
				//just swalow the exception
				//don't in real life
			//}
		}
		//Loop finished, draw everything
        context.drawImage(backBufferCanvas, 0, 0);
		
		processAll();
	};
}

var g_game = new Game();
g_game.startGame();