'use client'
import {motion, useScroll} from "framer-motion";
import './scrollindicator.css'
export default function ScrollIndicator(){
    const { scrollYProgress } = useScroll()
    return <motion.div style={{ scaleX: scrollYProgress }} className="scrollIndicator"/>
}