'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface MenuStarProps {
    onClick: () => void,
};

const MenuStar: React.FC<MenuStarProps> = ({ onClick }) => {
    
    const container = useRef(null);
    
    useGSAP(() => {
        gsap.to('.menu-star', {
            rotate: 360,
            repeat: -1,
            duration: 3,
            ease: 'linear',
        })
    }, [container]);

    return (
        <>
            <div className="relative cursor-pointer flex justify-center items-center"ref={container} onClick={onClick}>
                <img className="menu-star" src="menu-star-green.png" width={50} />
                <img className="absolute" src="pink-menu.svg" width={25} />
            </div>
        </>
    )
};

export default MenuStar;