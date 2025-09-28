import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-nexus-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-2xl font-bold">NEXUS</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted destination for quality products at amazing prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" data-testid="link-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white" data-testid="link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white" data-testid="link-contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white" data-testid="link-faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white" data-testid="link-shipping">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white" data-testid="link-returns">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=electronics" className="text-gray-400 hover:text-white" data-testid="link-footer-electronics">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=fashion" className="text-gray-400 hover:text-white" data-testid="link-footer-fashion">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-garden" className="text-gray-400 hover:text-white" data-testid="link-footer-home">
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link href="/products?category=sports" className="text-gray-400 hover:text-white" data-testid="link-footer-sports">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/products?category=books" className="text-gray-400 hover:text-white" data-testid="link-footer-books">
                  Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-nexus-accent" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-nexus-accent" />
                <span className="text-gray-400">support@nexus.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-nexus-accent" />
                <span className="text-gray-400">123 Commerce St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 NEXUS. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm" data-testid="link-terms">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm" data-testid="link-cookies">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
