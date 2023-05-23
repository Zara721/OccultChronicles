class Sound {
    constructor(src) {
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("controls", "none");
      this.sound.style.display = "none";
      this.sound.setAttribute("loop", "true");
      document.body.appendChild(this.sound);
    }
    
    //satrs to play the audio
    play() {
      this.sound.play();
    }
    
    //stops the audio playing
    stop() {
      this.sound.pause();
    }
    
    //makes the audio play in a loop
    loop() {
      this.sound.currentTime = 0;
      this.sound.play();
    }
  }
  
  