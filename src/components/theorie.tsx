'use client'
import "./theorie.css"
import {motion} from "framer-motion";
import {useEffect, useRef} from "react";
import mermaid from "mermaid";

const MermaidChart = ({ chart }: { chart: string }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            mermaid.initialize({
                'theme': 'base',
                'themeVariables': {
                    'primaryColor': '#7525bb',
                    'primaryTextColor': '#fff',
                    'primaryBorderColor': '#4a007c',
                    'lineColor': '#F8B229',
                    'secondaryColor': '#4218b1',
                    'tertiaryColor': '#fff',
                    'fontSize': "20px",
                    'borderRadius': "10px",
                },
            });
            try {
                if(chartRef.current.getAttribute('processed')){
                    chartRef.current.removeAttribute('processed');
                }
                mermaid.contentLoaded();
            } catch (error) {
                console.error('Failed to render Mermaid chart:', error);
            }
        }
    }, [chart]);

    return <div ref={chartRef} style={{minWidth: "50vw", alignItems: "center"}} className="mermaid">{chart}</div>;
};

export default function Theorie(){

    return(
        <motion.div className="theorie-container">
            <h1>Wie es funktioniert</h1>
            <MermaidChart chart={`
                flowchart TD
                   A[Zählen der individuellen Zeichen]
                   B[Verbinden der zwei Knoten mit der geringsten Priorität zu einem Neuen Knoten mit Priorität gleich Summe der alten Knoten]
                   C[Baum ist Fertig]
                   A-->B
                   B--Anzahl an Knoten > 1-->B
                   B--Anzahl an Knoten = 1-->C
                   
            `} />
        </motion.div>
    )
}