import Link from "next/link";
import { Camera, Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 pt-16 pb-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-6 h-6 text-zinc-900 dark:text-white" />
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">SSS STUDIO</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-sm mb-6">
              Capturing your special moments with professional photography and videography services. 
              Creating memories that last a lifetime.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/gallery" className="text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-zinc-400" />
                <span>34, prasanna new colony, Avaniyapuram, Madurai.</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                <Phone className="w-5 h-5 shrink-0 text-amber-600 dark:text-zinc-400" />
                <span>+91 63835 65425</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                <Mail className="w-5 h-5 shrink-0 text-amber-600 dark:text-zinc-400" />
                <span>ajayavinashsss@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 dark:text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} SSS Studio. All rights reserved.
          </p>
          <p className="text-zinc-400 dark:text-zinc-600 text-sm mt-2 md:mt-0">
            Designed & Built by Avinash
          </p>
        </div>
      </div>
    </footer>
  );
}
