import gsap from "gsap";

export const loaderAnimation = function(){
    const tl = gsap.timeline({ repeat: -1 });
    const circles = document.querySelectorAll(".loader > div");

    circles.forEach((circle, index) => {
        tl.to(circle, {
            y: -25,
            ease: "power1.inOut",
            duration: 0.4,
        }, index * 0.2)
        .to(circle, {
            y: 0,
            ease: "power1.outIn",
            duration: 0.4,
        },`-=0.12`);
    });
}

export const searchbarAnimation = function(){
        let tl = gsap.timeline({paused: true});
        const defaultDuration = .2;
        const defaultEase = "power3.inOut";
    
        tl.to("ion-icon",{
            duration: defaultDuration,
            ease: defaultEase,
            opacity: 0,
            position: "absolute",
            userSelect: "none"
        }).to(".search",{
            width: "400px",
            duration: defaultDuration,
            ease: defaultEase
        }).to("input",{
            ease: defaultEase,
            duration: defaultDuration,
            display: "inline-block"
        })
        
        return tl;
}

export const searchbarAnimationReverse = function(){
    let tl = gsap.timeline({paused: true});
    const defaultDuration = 0.2;
    const defaultEase = "power3.inOut";
    
    tl.to("ion-icon", {
        duration: defaultDuration,
        ease: defaultEase,
        position: "relative", // Assuming it should return to its normal flow
        userSelect: "auto" // Assuming it should return to selectable
    }).to("ion-icon",{
        opacity: 1,
    })
    .to(".search", {
        width: "70px", // Change back to initial width
        duration: defaultDuration,
        ease: defaultEase
    }, "<") // Ensure it starts at the same time as the previous tween
    .to("input", {
        ease: defaultEase,
        duration: defaultDuration,
        display: "none" // Change back to initial display state
    }, "<") // Ensure it starts at the same time as the previous tween
    
    return tl;
}