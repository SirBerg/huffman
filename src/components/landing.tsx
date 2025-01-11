import './landing.css'
export default function Landing(){
    return (
        <div className="Landing">
            <div className="centerContainer">
                <h1>
                    Der Huffmancode
                </h1>
                <div>
                    <p>
                        Der Huffmancode ist ein Algorithmus, der zur Komprimierung von Daten verwendet wird. Er wurde
                        von David A. Huffman entwickelt und 1952 in seiner Doktorarbeit vorgestellt. Der Algorithmus ist
                        verlustfrei, was bedeutet, dass die ursprünglichen Daten nach der Dekomprimierung
                        wiederhergestellt werden können. Der Algorithmus ist auch bekannt für seine Effizienz, da er die
                        Länge der codierten Daten minimiert.
                    </p>
                </div>
            </div>
            <div className="footer">
                Created by <a href="https://github.com/SirBerg" target="_blank">Sir Berg</a> so we don&#39;t get a bad grade (o-o)
            </div>
        </div>
    );
}