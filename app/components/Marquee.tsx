'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image from "next/image";

interface MarqueeProps {
    children: React.ReactNode;
};

const Marquee: React.FC<MarqueeProps> = ({ children }) => {
    const container = useRef(null);

    useGSAP(() => {
        gsap.to('.marquee', {
            x: "-338px",
            repeat: -1,
            duration: 5,
            ease: 'linear',
        })
    }, [container]);

    return (
        <>
            <div className="absolute 
                            top-0 
                            w-screen 
                            h-[6vh] 
                            flex 
                            flex-nowrap 
                            gap-10 
                            text-theme-green 
                            font-bold 
                            uppercase 
                            whitespace-nowrap 
                            bg-theme-yellow 
                            overflow-x-hidden 
                            z-50
                            balgin" 
                    ref={container}>
                        
                <div className="marquee leading-[5.7vh]">
                    {children}
                </div>
                <Image alt="" width={32} height={0}  className="marquee h-[2.5vh] self-center" src="/green-star.svg" />
                <div className="marquee leading-[5.7vh]">
                    {children}
                </div>
                <Image alt="" width={32} height={0}   className="marquee h-[2.5vh] self-center" src="/green-star.svg" />
                <div className="marquee leading-[5.7vh]">
                    {children}
                </div>
                <Image alt="" width={32} height={0}  className="marquee h-[2.5vh] self-center" src="/green-star.svg" />
                <div className="marquee leading-[5.7vh]">
                    {children}
                </div>
                <Image alt="" width={32} height={0}  className="marquee h-[2.5vh] self-center" src="/green-star.svg" />
                <div className="marquee leading-[5.7vh]">
                    {children}
                </div>
                <Image alt="" width={32} height={0}  className="marquee h-[2.5vh] self-center" src="/green-star.svg" />
                <div className="marquee leading-[5.7vh]">
                    {children}
                </div>
                <Image alt="" width={32} height={0} className="marquee h-[2.5vh] self-center" src="/green-star.svg" />
                <div className="marquee leading-[5.7vh]">
                    {children}
                </div>
            </div>
        </>
    )
};

export default Marquee;