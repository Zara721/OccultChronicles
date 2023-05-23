class SceneTransition {
    constructor() {
        this.element = null;
    }

    //make transition element
    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("SceneTransition");
    }

    //fades out and removes transition element
    fadeOut() {
        this.element.classList.add("fade-out");

        this.element.addEventListener("animationend", () => {
            this.element.remove();
        }, {once: true})
    }

    //initializes transition and call handles callback
    init(container, callBack) {
        this.createElement();
        container.appendChild(this.element);

        this.element.addEventListener("animationend", () => {
            callBack();
        }, {once: true})

    }
}