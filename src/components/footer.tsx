import './footer.css'
import Image from "next/image";
export default function Footer() {
    return (
        <footer className="footerContainer">
            <div className="inner">
                Created by <a href="https://boerg.co"> Sir Berg</a> and <a href="https://github.com/DankMozart">Dank Mozart</a>
                <br />
                with awesome <a href="/software.txt"> OSS Software</a>
                <br />
                Licensed under <a href="/license.txt">GLWTS(Good Luck With That Shit, No LLMs) Public License</a>
                <br />
                <div className="githubLink">
                    <a href="https://github.com/SirBerg/huffman">
                        <Image src="/github.svg" alt="Github Logo" height={25} width={25}/>
                    </a>
                </div>

            </div>
        </footer>
    )
}