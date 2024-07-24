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
        let tl = gsap.timeline({});
        const defaultDuration = .2;
        const defaultEase = "power3.inOut";
    
        tl.to("ion-icon",{
            duration: defaultDuration,
            ease: defaultEase,
            opacity: 0,
            display: "none"
        }).to(".search",{
            width: "100%",
            duration: defaultDuration,
            ease: defaultEase
        }).to("input",{
            ease: defaultEase,
            duration: defaultDuration,
            display: "inline-block"
        })
}