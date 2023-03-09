WebFont.load({
    google: {
        families: ['Press Start 2P']
    },
    active: e => {
        console.log("font loaded!");
        // pre-load the images
        app.loader.
            add([
                "images/assets/Main2.png",
                "images/assets/explosions.png",
                "images/assets/Alien2.png",
                "images/assets/Background.png",
                "images/assets/Battery2.png",
                "images/assets/DeadAlien.png",
                "images/assets/move.png"
            ]);
        app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
        app.loader.onComplete.add(setup);
        app.loader.load();
    }
});