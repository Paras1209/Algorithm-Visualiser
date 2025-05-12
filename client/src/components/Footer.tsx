import * as React from "react";
import { Link } from "wouter";
import { 
  GithubIcon, 
  LinkedinIcon, 
  TwitterIcon, 
  GlobeIcon, 
  MailIcon 
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Algorithm Visualizer</h2>
            <p className="text-slate-400 text-sm mt-1">
              An interactive educational tool for learning algorithms
            </p>
          </div>
          
          <div className="flex justify-center space-x-5 mb-4">
            <a 
              href="https://github.com/paras1209" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com/in/dtu/paras-kanojia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com/kanojia16_paras" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Twitter Profile"
            >
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a 
              href="https://portfolio-parasatdtu.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Portfolio Website"
            >
              <GlobeIcon className="h-5 w-5" />
            </a>
            <a 
              href="mailto:kanojiaparas582@gmail.com" 
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Email Contact"
            >
              <MailIcon className="h-5 w-5" />
            </a>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Developed by <a href="https://portfolio-parasatdtu.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Paras Kanojia</a>
            </p>
            <p className="text-slate-500 text-xs mt-2">
              © {new Date().getFullYear()} | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;